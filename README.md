# punycache
A minimalist cache implementation.

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

* `ttl` : *(default: `Number.POSITIVE_INFINITY`)* Time to live of keys in the cache, expressed in milliseconds
* `max` : *(default: `Number.POSITIVE_INFINITY`)* Maximum number of keys to be stored in the cache (see `policy` for cache replacement policies)
* `policy` : Cache replacement policy, supported values are
  * `'lru'` *(default)* Least Recently Used (each `get` / `set` updates used timestamp)
  * `'lfu'` Least Frequently Used (each `get` / `set` increments usage frequency)

## Implementation notes :

* Values are stored and returned **as-is**
* Keys are removed from the cache **when required** *(no timeout is being used)*
