# punycache 🦴

[![Node.js CI](https://github.com/ArnaudBuchholz/punycache/actions/workflows/node.js.yml/badge.svg)](https://github.com/ArnaudBuchholz/punycache/actions/workflows/node.js.yml)
[![Mutation Testing](https://img.shields.io/badge/mutation%20testing-100%25-green)](https://arnaudbuchholz.github.io/punycache/reports/mutation/mutation.html)
![no dependencies](https://img.shields.io/badge/-no_dependencies-green)
[![Package Quality](https://npm.packagequality.com/shield/punycache.svg)](https://packagequality.com/#?package=punycache)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudBuchholz/punycache/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ArnaudBuchholz/punycache?targetFile=package.json)
[![punycache](https://badge.fury.io/js/punycache.svg)](https://www.npmjs.org/package/punycache)
[![punycache](http://img.shields.io/npm/dm/punycache.svg)](https://www.npmjs.org/package/punycache)
[![install size](https://packagephobia.now.sh/badge?p=punycache)](https://packagephobia.now.sh/result?p=punycache)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/-documentation-blueviolet)](https://github.com/ArnaudBuchholz/punycache/tree/master/README.md)

A *minimalist* cache implementation.

## Usage

```javascript
const cache = require('punycache')()

cache.set('key', 'Hello World !')
console.log(cache.get('key')) // Hello World !
console.log(cache.keys()) // [ 'key' ]
console.del('key')
console.log(cache.get('key')) // undefined
```

## Options

```javascript
const cache = require('punycache')({
  ttl: 200,
  max: 100,
  policy: 'lfu'
})
```

* `ttl` : *(default: `Number.POSITIVE_INFINITY`)* Time to live in the cache, expressed in milliseconds
* `max` : *(default: `Number.POSITIVE_INFINITY`)* Maximum number of keys to be stored in the cache (see `policy` for cache replacement policies)
* `policy` : Cache replacement policy, supported values are
  * `'lru'` *(default)* Least Recently Used (each `get` / `set` updates used timestamp)
  * `'lfu'` Least Frequently Used (each `get` / `set` increments usage frequency)

## Implementation notes :

* Values are stored and returned **as-is**
* Keys are removed from the cache **ad-hoc** *(no timeout is being used)*
