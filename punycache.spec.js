'use strict'

const punycache = require('./punycache')

describe('punycache', () => {
  let cache

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('happy path', () => {
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
      cache.set('b', 2)
      cache.del('a')
      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toStrictEqual(2)
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

  describe('options validation', () => {
    const invalidValues = ['1', 0, -1, 'a', '', true, false, function () {}]

    function test (option) {
      describe(option, () => {
        invalidValues.forEach(invalidValue => {
          it(`accepts only numbers (${JSON.stringify(invalidValue)})`, () => {
            expect(() => punycache({ [option]: invalidValue })).toThrow({
              message: `Invalid ${option}`
            })
          })
        })
      })
    }

    test('ttl')

    test('max')

    describe('policy', () => {
      it('accepts only known values', () => {
        expect(() => punycache({ policy: 'unknown' })).toThrow({
          message: 'Invalid policy'
        })
      })
    })
  })

  describe('ttl', () => {
    beforeEach(() => {
      cache = punycache({ ttl: 100 })
    })

    it('keeps a value until ttl is reached', () => {
      cache.set('a', 'a')
      expect(cache.get('a')).toStrictEqual('a')
    })

    it('invalidates a value when ttl is reached (get)', () => {
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

    describe('lru (default)', () => {
      it('removes the oldest key when when inserting more values', () => {
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

      it('also refreshes timestamp on a get', () => {
        cache.set('a', 1)
        jest.advanceTimersByTime(1)
        cache.set('b', 1)
        jest.advanceTimersByTime(1)
        cache.get('a')
        jest.advanceTimersByTime(1)
        cache.set('c', 1)
        expect(cache.get('b')).toBeUndefined()
        expect(cache.keys().sort()).toStrictEqual([
          'a',
          'c'
        ])
      })
    })

    describe('lfu', () => {
      beforeEach(() => {
        cache = punycache({
          max: 2,
          policy: 'lfu'
        })
      })

      it('removes the least frequently used key when when inserting more values', () => {
        cache.set('a', 1)
        cache.get('a')
        cache.set('b', 1)
        cache.set('c', 1)
        expect(cache.get('b')).toBeUndefined()
        expect(cache.keys().sort()).toStrictEqual([
          'a',
          'c'
        ])
      })

      it('removes the least frequently used key when when inserting more values', () => {
        cache.set('a', 1)
        cache.set('b', 1)
        cache.set('b', 1)
        cache.set('c', 1)
        expect(cache.get('a')).toBeUndefined()
        expect(cache.keys().sort()).toStrictEqual([
          'b',
          'c'
        ])
      })
    })
  })
})
