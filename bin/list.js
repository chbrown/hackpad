#!/usr/bin/env node
const {Hackpad} = require('..');
const client = Hackpad.loadFromEnvironment();

client.list((err, ids) => {
  if (err) throw err;
  console.log(ids.join('\n'));
});
