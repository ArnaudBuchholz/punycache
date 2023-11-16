'use strict'

const punycache = require('./punycache')

describe('punycache', () => {
  describe('happy path', () => {
    let cache

    beforeEach(() => {
      cache = punycache()
    })

    it('stores a value', () => {
      cache.set('a', 'a')
      expect(cache.get('a')).toStrictEqual('a')
    })

    it('replaces a value', () => {
      cache.set('a', 1)
      cache.set('a', 2)
      expect(cache.get('a')).toStrictEqual(2)
    })

    it('removes a value', () => {
      cache.set('a', 1)
      cache.del('a')
      expect(cache.get('a')).toBeUndefined()
    })

    it('lists values', () => {
      cache.set('a', 1)
      cache.set('b', 1)
      expect(cache.keys().sort()).toStrictEqual([
        'a',
        'b'
      ])
    })

    it('removes all values', () => {
      cache.set('a', 1)
      cache.set('b', 2)
      cache.del()
      expect(cache.keys()).toStrictEqual([])
    })
  })
})
