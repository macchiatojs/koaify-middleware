import { expect } from 'chai'
import Middleware from '../src'

describe('middleware', () => {
  // TODO: to fix these unkonwn types.
  let context: Middleware<unknown>

  beforeEach(() => {
    context = new Middleware()
  })

  it('middleware should an array-like object', ()=> {
    const middleware = context
    expect(middleware).to.be.instanceof(Middleware)
    expect(middleware).to.be.instanceof(Array)
  })

  it('middleware compose should return result and not throws', () => {
    const middleware = context
    expect(() => middleware.compose(null)).to.not.throws()
  })

  it('middleware compose should return result and throws', () => {
    const middleware = context
    middleware.push((ctx, next) => {
      ctx.a = 1
      next()
      next()
    })

    middleware.compose({}).catch((result) => {
      expect(result).to.be.equal(/next() called multiple times/)
    })     
  })

  it('iterator', async () => {
    const middleware = context
    
    middleware.push((ctx, next) => {
      ctx.arr.push(1)
      return next().then(() => {
        ctx.sended = true
        ctx.arr.push(6)
      })
    })

    middleware.push(async (ctx, next) => {
      ctx.arr.push(2)
      await next()
      ctx.arr.push(5)
    })

    middleware.push((ctx, next) => {
      ctx.arr.push(3)
      next()
      ctx.arr.push(4)
    })
  
    const iter = middleware[Symbol.iterator]()

    expect(typeof iter.next).to.equal('function')

    const ctx = { arr: [] }
  
    await middleware.compose(ctx)
  
    expect(ctx.arr).to.deep.equal([1, 2, 3, 4, 5, 6])
  })
})
