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

  const cache = Object.create(null)

  const now = () => Date.now()
  const keys = () => Object.keys(cache)

  const deleteLowestBasedOnMember = member => () => {
    let last = infinity
    let lastKey
    for (const key in cache) {
      const { [member]: current } = cache[key]
      // Stryker disable EqualityOperator
      if (current < last) { // or <= does not change the logic
        last = current
        lastKey = key
      }
    }
    delete cache[lastKey]
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
    for (const key in cache) {
      const { e } = cache[key]
      if (e <= nowInMs) {
        delete cache[key]
        changed = true
      }
    }
    return changed
  }

  const access = key => {
    const cached = cache[key]
    const nowInMs = now()
    if (cached && cached.e > nowInMs) {
      cached.t = nowInMs
      return cached
    }
  }

  return {
    set (key, v) {
      const nowInMs = now()
      let cached = access(key)
      if (!cached) {
        keys().length === max && !prune() && remove()
        cached = {
          f: 0
        }
        cache[key] = cached
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
      delete cache[key]
    },

    keys () {
      prune()
      return keys()
    }
  }
}
