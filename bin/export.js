#!/usr/bin/env node
const {Hackpad} = require('..');
const client = Hackpad.loadFromEnvironment();

const id = process.argv[2];
const revision = process.argv[3] || 'latest';

client.export(id, revision, 'html', (err, pad) => {
  if (err) throw err;
  process.stdout.write(pad);
});
