# @macchiatojs/koaify-middleware

The modern **Koa-Style** middleware composition.

## `Installation`

```bash
# npm
$ npm install @macchiatojs/koaify-middleware
# yarn
$ yarn add @macchiatojs/koaify-middleware
```

## `Usage`

```typescript
import Middleware from "@macchiatojs/koaify-middleware";

const middleware = new Middleware();

middleware.push((ctx, next) => {
  ctx.arr.push(1);
  return next().then(() => {
    ctx.arr.push(6);
  });
});

middleware.push(async (ctx, next) => {
  ctx.arr.push(2);
  await next();
  ctx.arr.push(5);
});

middleware.push((ctx, next) => {
  ctx.arr.push(3);
  next();
  ctx.arr.push(4);
});

const ctx = { arr: [] };

await middleware.compose(ctx);
console.log(ctx.arr.toString() === "1,2,3,4,5,6");
// true
```

## `Support`

If you have any problem or suggestion please open an issue.

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)
