# Hackpad API client

Node.js client library for the Hackpad API, version 1.0.


## Archival

On April 25, 2017, Hackpad announced they are shutting down.

> I’m writing to let you know we’ll be shutting down Hackpad on July 19.
> [...]
> Igor Kofman, Hackpad founder and Dropbox Paper lead

They provide automated archives of pads you've created, but not all pads you have access to.

Here's how to back up all your Hackpad documents:

**First**, install this package: `npm install -g chbrown/hackpad`

**Second**, create a new directory and download this [`Makefile`](docs/Makefile) into it:

```make
IDS := $(shell cat *-ids.txt)

all: $(IDS:%=html/%.html) $(IDS:%=revisions/%.json)

personal-ids.txt:
	hackpad-list > $@

html/%.html:
	@mkdir -p $(@D)
	hackpad-export $* > $@

revisions/%.json:
	@mkdir -p $(@D)
	hackpad-revisions $* > $@
```

**Third**, go to <https://hackpad.com/ep/account/settings/> and copy down your Client ID and Secret like so:

```sh
export HACKPAD_CLIENT_ID=k8EXAMPLE1d
export HACKPAD_SECRET=4mEXAMPLEtj45gTlBW31mlFnEXAMPLE9
```

**Fourth**, run `make personal-ids.txt`, which will list your the IDs of your personal Hackpads (the Hackpads you've created):

**Fifth**, create a file `other-ids.txt`, and add other Hackpad IDs that you have access to and want to archive.

For example, on a "collection" page, run the following in your browser's console:

```javascript
[...document.querySelectorAll('#list-of-pads-div a')].map(a =>
  a.href.match(/\/(\w{11})/)).filter(m => m).map(m => m[1]).join('\n')
```

Copy and paste this string into the `other-ids.txt` file.

**Finally**, run `make` in the directory. This reads all the files matching `*-ids.txt` in your current directory, and uses the `hackpad-export` and `hackpad-revisions` scripts provided by this package to download html exports into an `html/` directory, and the JSON revisions into a `revisions/` directory (it will create these directories as needed).


## Installation & Usage

Install with npm:

```sh
npm install chbrown/hackpad
```

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
