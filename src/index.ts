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

export type Next = () => Promise<any>;

/**
 * modern middleware composition.
 *
 * @param {Object} options
 * @api public
 */
class Middleware <Context = unknown> extends Array {
  #next (
    context: Context,
    last?: Next,
    index = 0,
    done = false,
    called = false,
    fn?: (context: Context, next: Next) => any
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

  compose (context: Context, last?: Next) {
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
