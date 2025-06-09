'use strict'

module.exports = function factory (options = {}) {
  const infinity = Number.POSITIVE_INFINITY

  const getNumber = (member) => {
    const value = options[member]
    if (value === undefined) {
      return infinity
    }
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`Invalid ${member}`)
    }
    return value
  }

  const ttl = getNumber('ttl')
  const max = getNumber('max')
  const policy = options.policy || 'lru'

  const cache = new Map()

  const now = () => Date.now()
  const keys = () => cache.keys()

  const deleteLowestBasedOnMember = member => () => {
    let last = infinity
    let lastKey
    for (const key of keys()) {
      const { [member]: current } = cache.get(key)
      // Stryker disable EqualityOperator
      if (current < last) { // or <= does not change the logic
        last = current
        lastKey = key
      }
    }
    cache.delete(lastKey)
  }

  const policies = {
    lru: deleteLowestBasedOnMember('t'),
    lfu: deleteLowestBasedOnMember('f')
  }

  const remove = policies[policy]
  if (remove === undefined) {
    throw new Error('Invalid policy')
  }

  const prune = () => {
    const nowInMs = now()
    let changed = false
    for (const key of keys()) {
      const { e } = cache.get(key)
      if (e <= nowInMs) {
        cache.delete(key)
        changed = true
      }
    }
    return changed
  }

  const access = key => {
    const cached = cache.get(key)
    if (cached) {
      const nowInMs = now()
      if (cached.e > nowInMs) {
        cached.t = nowInMs
        return cached
      }
    }
  }

  return {
    set (key, v) {
      const nowInMs = now()
      let cached = access(key)
      if (!cached) {
        cache.size === max && !prune() && remove()
        cached = {
          f: 0
        }
        cache.set(key, cached)
      }
      Object.assign(cached, {
        e: nowInMs + ttl,
        t: nowInMs,
        f: cached.f + 1,
        v
      })
    },

    get (key) {
      const cached = access(key)
      if (cached) {
        ++cached.f
        return cached.v
      }
    },

    del (key) {
      cache.delete(key)
    },

    keys () {
      prune()
      return Array.from(keys())
    }
  }
}
