'use strict'

module.exports = function factory (options = {}) {
  const infinity = Number.POSITIVE_INFINITY

  const getNumber = (member) => {
    const value = options[member]
    if (value === undefined) {
      return infinity
    }
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`Invalid value for ${member}`)
    }
    return value
  }

  const ttl = getNumber('ttl')
  const max = getNumber('max')
  const policy = options.policy || 'lru'

  const empty = () => Object.create(null)
  const now = () => Date.now()

  let cache = empty()

  const keys = () => Object.keys(cache)

  const policies = {
    lru () {
      let lastUsed = infinity
      let lastKey
      keys().forEach(key => {
        const { t } = cache[key]
        if (t < lastUsed) {
          lastKey = key
          lastUsed = t
        }
      })
      delete cache[lastKey]
    },

    lfu () {
      let lowestFrequency = infinity
      let lowestKey
      keys().forEach(key => {
        const { f } = cache[key]
        if (f < lowestFrequency) {
          lowestKey = key
          lowestFrequency = f
        }
      })
      delete cache[lowestKey]
    }
  }

  const remove = policies[policy]
  if (remove === undefined) {
    throw new Error('Unknown policy')
  }

  const prune = () => {
    const nowInMs = now()
    let count = 0
    keys().forEach(key => {
      const { e } = cache[key]
      if (e <= nowInMs) {
        delete cache[key]
        ++count
      }
    })
    return count
  }

  return {
    set (key, v) {
      keys().length === max && prune() === 0 && remove()
      const nowInMs = now()
      cache[key] = {
        e: nowInMs + ttl,
        t: nowInMs,
        f: 1,
        v
      }
    },

    get (key) {
      const cached = cache[key]
      const nowInMs = now()
      if (cached && cached.e > nowInMs) {
        cache.t = nowInMs
        ++cached.f
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
