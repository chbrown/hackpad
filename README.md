# Hackpad API client

Node.js client library for the Hackpad API, version 1.0.


## Installation & Usage

Install with npm:

    npm install chbrown/hackpad

Require in your app:

```javascript
const {Hackpad} = require('hackpad');
```

Instantiate the client with your Hackpad Oauth Client ID and secret.
You can find these on the [account/settings](https://hackpad.com/ep/account/settings/) page.

```javascript
const client = new Hackpad(client_id, secret);
```

If you have a custom Hackpad site, you can provide this via an optional argument:

```javascript
const client = new Hackpad(client_id, secret, 'mycompany.hackpad.com');
```

Then, just run commands on your fancy new client instance:

```javascript
client.create('This is an awesome hackpad');
```

All methods take a callback function, and JSON responses are parsed automatically:

```javascript
client.create('I like this hackpad even more', (err, result) => {
  if (err) throw err;
  console.log('Created pad with ID=' + result.padId);
});
```

For non-JSON responses (like `export`), the raw body is returned.


## Client methods

See the official [API documentation](https://hackpad.com/ep/pad/summary/k9bpcEeOo2Q?show=40) for details.

### Data access (GET) calls

```javascript
client.list(callback)
```

```javascript
client.search(query, callback)
```

* `query` is an option with the keys:
  - `q` Search term (required)
  - `start` Offset to start from
  - `limit` How many results to return


```javascript
client.create(body, contentType, callback)
```

* `body` a string of body text
* `contentType` One of `text/html`, `text/x-web-markdown`, or `text/plain`

```javascript
client.import(padId, body, contentType, callback)
```

* `padId` ID of an existing (or not-existing) pad
* `body` a string of body text
* `contentType` One of `text/html`, `text/x-web-markdown`, or `text/plain`

```javascript
client.revert(padId, revisionId, callback)
```

```javascript
client.export(padId, revisionId, format, callback)
```

* `padId` ID of an existing pad
* `revisionId` The revision to export; either a numeric ID or the string `latest`
* `format` One of `html`, `md`, `txt`, or `native`
  - `html` is recommended since `md` and `txt` are derived from HTML
  - `native` just adds a lot of Ace editor markup to the HTML

```javascript
client.editedSince(timestamp, callback)
```

* `padId` ID of an existing pad
* `timestamp` A Date object

```javascript
client.revisions(padId, callback)
```

* `padId` ID of an existing pad

```javascript
client.revokeAccess(email, callback)
```

* `email` Email address of the user to revoke access for

```javascript
client.removeUser(email, callback)
```

* `email` Email address of the user to remove

```javascript
client.setEmailEnabled(email, setting, callback)
```

* `email` Email address of the user to update
* `setting` `true` or `false` (as strings)


## License

[MIT Licensed](https://chbrown.github.io/licenses/MIT/#2017).

* Copyright © 2013 Lou Kosak <lkosak@gmail.com>
* Copyright © 2017 Christopher Brown <io@henrian.com>
