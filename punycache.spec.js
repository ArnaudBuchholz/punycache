'use strict'

const punycache = require('./punycache')

describe('punycache', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

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

  describe('ttl', () => {
    let cache

    beforeEach(() => {
      cache = punycache({ ttl: 100 })
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('keeps a value until ttl is reached', () => {
      cache.set('a', 'a')
      expect(cache.get('a')).toStrictEqual('a')
    })
    
    it('removes a value when ttl is reached (get)', () => {
      cache.set('a', 'a')
      jest.advanceTimersByTime(100)
      expect(cache.get('a')).toBeUndefined()
    })

    it('removes a value when ttl is reached (keys)', () => {
      cache.set('a', 'a')
      jest.advanceTimersByTime(100)
      expect(cache.keys()).toStrictEqual([])
    })
  })

  describe('max', () => {
    let cache

    beforeEach(() => {
      cache = punycache({ max: 2 })
    })

    it('can store up to the max number of values', () => {
      cache.set('a', 1)
      cache.set('b', 1)
      expect(cache.keys().sort()).toStrictEqual([
        'a',
        'b'
      ])
    })

    it('removes the oldest value when when inserting more values', () => {
      cache.set('a', 1)
      jest.advanceTimersByTime(1)
      cache.set('b', 1)
      jest.advanceTimersByTime(1)
      cache.set('c', 1)
      expect(cache.get('a')).toBeUndefined()
      expect(cache.keys().sort()).toStrictEqual([
        'b',
        'c'
      ])
    })
  })
})
