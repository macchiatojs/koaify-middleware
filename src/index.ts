/**
 * @macchiatojs/koaify-middleware
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * decalre types.
 */

export type NextFunc = () => Promise<any>;
export type MiddlewareFunc<Context> = (context: Context, next: NextFunc) => any

/**
 * modern middleware composition.
 *
 * @param {Object} options
 * @api public
 */
class Middleware <Context> extends Array {
  #next (
    context: Context,
    last?: NextFunc,
    index = 0,
    done = false,
    called = false,
    fn?: MiddlewareFunc<Context>
  ) {
    /* istanbul ignore next */
    if ((done = index > this.length)) return

    fn = this[index] || last

    return fn && fn(context, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.#next(context, last, index + 1))
    })
  }

  compose (context: Context, last?: NextFunc) {
    try {
      return Promise.resolve(this.#next(context, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

/**
 * Expose `Middleware`.
 */

export default Middleware
