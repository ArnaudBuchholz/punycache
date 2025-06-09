import { Bench } from 'tinybench'
import cacheFactory from './punycache.js'

let cache

const bench = new Bench({
  name: 'cache performances',
  time: 100,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc()
    }
    cache = cacheFactory({
      ttl: 200,
      max: 5,
      policy: 'lfu'
    })
    cache.set('key-0', 'value-0')
  }
})

bench
  .add('allocating the cache', () => {
    cacheFactory({
      ttl: 200,
      max: 100,
      policy: 'lfu'
    })
  })
  .add('adding one key', () => {
    cache.set('key-1', 'value-1')
  })
  .add('replacing one key', () => {
    cache.set('key-0', 'value-1')
  })
  .add('deleting one key', () => {
    cache.del('key-0')
  })
  .add('getting an existing key', () => {
    cache.get('key-0')
  })
  .add('getting an unknown key', () => {
    cache.get('key-1')
  })
  .add('going beyond the max size', () => {
    for (let i = 2; i < 10; i++) {
      cache.set(`key-${i}`, `value-${i}`)
    }
  })

await bench.run()

console.log(bench.name)
console.table(bench.table())
