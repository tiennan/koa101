const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    if (!ctx.request.query.name) {
        ctx.throw(400, 'name required');
    }

    ctx.body = `Hello World ${ctx.request.query.name}`;
});

app.listen(3002);
