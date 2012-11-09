#!/usr/bin/env node
"use strict";
var fs = require('fs'), os = require('os'), util = require('util');
var timestamp = Math.round(Date.now() / 1000), hostname = os.hostname();
var notdone = [], i = 0;
var err_msg = " Mail spool building up on: " + hostname;
var queue_msg = " Current Queue Length: ";

var getopt = require('node-getopt').create([
  ['c', 'critical='],
  ['d', 'debug'],
  ['e', 'exclude='],
  ['h', 'help'],
  ['m', 'metrics'],
  ['p', 'path='],
  ['s', 'scheme='],
  ['w', 'warning=']
]).bindHelp();

var opt = getopt.parse(process.argv.slice(2));

if ((opt.options.critical || opt.options.warning) && opt.options.metrics) {
  console.log("Usage Error: Can't do metrics and status checks together");
  process.exit(3);
}

if (!opt.options.path) {
  console.log("Path Error: path not given");
  process.exit(3);
}

fs.exists(opt.options.path, function (exists) {
  if (opt.options.debug) {
    util.debug(exists ? "path found" : "Path Error: path not found");
  }
})

var pathArray = fs.readdirSync(opt.options.path);

if (opt.options.exclude) {
  while (i < pathArray.length) {
    if (!pathArray[i].match(opt.options.exclude)) {
      notdone.push(pathArray[i]);
    }
    i = (i + 1);
  }
} else {
  notdone = pathArray;
}

if (opt.options.critical < notdone.length) {
  console.log(opt.options.critical);
  console.log("Critical" + err_msg + queue_msg + notdone.length);
  process.exit(2);
} else {
  if (opt.options.warning < notdone.length) {
    console.log("Warning" + err_msg + queue_msg + notdone.length);
    process.exit(1);
  }
}

if (opt.options.metrics) {
  var scheme = hostname;
  if (opt.options.scheme) {
    scheme = opt.options.scheme;
  }
  var path = opt.options.path.replace(/\//gm, '.');
  console.log(scheme + path + ' ' +  notdone.length + ' ' + timestamp);
}
