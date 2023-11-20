declare module 'punycache' {
  interface Options {
    ttl?: number
    max?: number
    policy?: 'lru' | 'lfu'
  }

  interface Cache {
    set (key: string, value: any): void
    get (key: string): any
    del (key: string): void
    keys (): string[]
  }

  function punycache (options?: Options): Cache

  export = punycache
}
