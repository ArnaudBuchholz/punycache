'use strict'

module.exports = function factory (options = {}) {
  const {
    ttl = Number.POSITIVE_INFINITY,
    max = 0
  } = options
  const empty = () => Object.create(null)
  let cache = empty()
  const keys = () => Object.keys(cache)

  const prune = () => {
    const now = Date.now()
    keys().forEach(key => {
      const { e } = cache[key]
      if (e <= now) {
        delete cache[key]
      }
    })
  }

  return {
    set (key, v) {
      if (keys().length > max) {
      }
      cache[key] = {
        e: Date.now() + ttl,
        v
      }
    },

    get (key) {
      const cached = cache[key]
      const now = Date.now()
      if (cached && cached.e > now) {
        return cached.v
      }
    },

    del (key = '') {
      if (key) {
        delete cache[key]
      } else {
        cache = empty()
      }
    },

    keys () {
      prune()
      return keys()
    }
  }
}
