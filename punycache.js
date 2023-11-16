'use strict'

module.exports = function factory (options = {}) {
  const {
    ttl = 0,
    size = 0,
    interval = 1000
  } = options
  let cache = {}
  return {
    set (key, value) {
      cache[key] = {
        ts: Date.now(),
        value
      }
    },

    get (key) {
      const cached = cache[key]
      if (cached) {
        return cached.value
      }
    },

    del (key = '') {
      if (key) {
        delete cache[key]
      } else {
        cache = []
      }
    },

    keys () {
      return Object.keys(cache)
    }
  }
}
