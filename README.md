
# SizeRange

[![npm version](https://badge.fury.io/js/take-easy.svg)](https://www.npmjs.com/package/size-range)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a Node.js module for parsing and working with file size ranges.

## Installation

```shell
npm install size-range
```
## Usage

Using this function :

```javascript
const sizerange = require('size-parser');

const range = sizerange('10KB-1MB');
```

By instantiating a class :

```javascript
const {SizeRange} = require('size-parser');

const range = new SizeRange('10KB-1MB');
```

You can now check if a given size is within the specified range:

```javascript
const size = 500000; // 500 KB

console.log(range.check(size)); // true
```


## Working on files

Check a file size :

```javascript
range.checkFile('/path/to/file.txt')
  .then(result => {
    console.log(result); // true or false
  })
  .catch(error => {
    console.error(error);
  });
```

...or synchronously :

```javascript
console.log(
  range.checkFileSync(filePath)
);
```

## Size Range Format

 - Units are case insensitive.
 - Unnecessary spaces are taken into account.

Examples of range :

```javascript

  sizerange('100kb'); // or '=100kb', 'equal 100kb', no unit means equal
  sizerange('100'); // or '100B', no unit means byte

  sizerange('> 10 MB'); // or ' >10mb '
  sizerange('<=50kb');
  sizerange('max 1mb');

  sizerange('10kb-1mb');
  sizerange('between 10kb and 1mb');
```

## Available Units

The following units are supported:

 - Byte (b)
 - Kilobyte (KB)
 - Megabyte (MB)
 - Gigabyte (GB)
 - Terabyte (TB)
 - Petabyte (PB)
 - Exabyte (EB)
 - Zettabyte (ZB)
 - Yottabyte (YB)

## Translations

All words or regex are configurable :

```javascript

const {SizeRange, units, regexes} = require('size-range');

units.megabyte.text = 'mo';

regexes.between = /^entre\s+(?<min>.+?)\s+et\s+(?<max>.+?)$/i;

const range = new SizeRange('entre 1mo et 2mo');

```

## Functions

You can separately parse size or range ;

```javascript

const {parseSize, parseRange} = require('size-range');

console.log(parseSize('100kb')); // 102400

console.log(parseRange('1mb-2mb')); // { min: 1048576, max: 2097152 }

```

# License

This project is licensed under the MIT License. See the LICENSE file for more information.
