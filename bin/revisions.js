#!/usr/bin/env node
const {Hackpad} = require('..');
const client = Hackpad.loadFromEnvironment();

const id = process.argv[2];

client.revisions(id, (err, revisions) => {
  if (err) throw err;
  console.log(JSON.stringify(revisions));
});
