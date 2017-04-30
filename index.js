const oauth = require('oauth-client');
const querystring = require('querystring');

const GET = 'GET';
const POST = 'POST';

class Hackpad {
  constructor(key, secret, host = 'hackpad.com') {
    const consumer = oauth.createConsumer(key, secret);
    this.signer = oauth.createHmac(consumer);
    this.host = host;
  }
  static loadFromEnvironment() {
    const key = process.env.HACKPAD_CLIENT_ID || process.env.HACKPAD_KEY;
    const secret = process.env.HACKPAD_SECRET;
    if (!(key && secret)) {
      throw new Error('Could not load Hackpad Client ID / Secret from environment');
    }
    return new Hackpad(key, secret);
  }

  request(method, path, headers, body, callback) {
    const request = {
      port: 443,
      host: this.host,
      https: true,
      path: '/api/1.0' + path,
      oauth_signature: this.signer,
      method: method,
      headers: Object.assign({
        'Content-Length': body ? body.length : 0,
      }, headers),
    };

    // console.error('Request map', request);
    const req = oauth.request(request, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        // chunk is a Buffer
        chunks.push(chunk);
      });
      res.on('end', () => {
        // console.error('Response headers', res.headers);
        const body = Buffer.concat(chunks);
        if (res.headers['content-type'].includes('application/json')) {
          const data = JSON.parse(body);
          if (data.error) {
            callback(data.error);
          } else {
            callback(null, data);
          }
        } else {
          // .toString('latin1')
          callback(null, body);
        }
      });
    });
    req.on('error', callback);
    if (body) req.write(body);
    req.end();
  }

  list(callback) {
    this.request(GET, `/pads/all`, {}, null, callback);
  }
  /**
  query is a map with the keys:
  * q: string
  * start: int (optional)
  * limit: int (optional)
  */
  search(query, callback) {
    this.request(GET, `/search?${querystring.stringify(query)}`, {}, null, callback);
  }
  /**
  padId: 11 character identifier
  revisionId: "latest"
  format: "txt" | "md" | "native" | "html"
  */
  export(padId, revisionId, format, callback) {
    this.request(GET, `/pad/${padId}/content/${revisionId}.${format}`, {}, null, callback);
  }
  editedSince(date, callback) {
    const timestamp = new Date(date);
    this.request(GET, `/edited-since/${timestamp.getTime()}`, {}, null, callback);
  }
  revisions(padId, callback) {
    this.request(GET, `/pad/${padId}/revisions`, {}, null, callback);
  }

  /**
  contentType: "text/html" | "text/x-web-markdown" | "text/plain"
  */
  create(body, contentType, callback) {
    this.request(POST, `/pad/create`, {'Content-Type': contentType}, body, callback);
  }
  /**
  contentType: "text/html" | "text/x-web-markdown" | "text/plain"
  */
  import(padId, body, contentType, callback) {
    this.request(POST, `/pad/${padId}/content`, {'Content-Type': contentType}, body, callback);
  }
  revert(padId, revisionId, callback) {
    this.request(POST, `/pad/${padId}/revert-to/${revisionId}`, {}, null, callback);
  }
  revokeAccess(padId, email, callback) {
    this.request(POST, `/pad/${padId}/revoke-access/${email}`, {}, null, callback);
  }
  removeUser(email, callback) {
    this.request(POST, `/user/${email}/remove`, {}, null, callback);
  }
  /**
  setting: "true" | "false"
  */
  setEmailEnabled(email, setting, callback) {
    this.request(POST, `/user/${email}/settings?send-email=${setting}`, {}, null, callback);
  }
}

module.exports.Hackpad = Hackpad;
