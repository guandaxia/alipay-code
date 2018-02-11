const mysql = require('../libs/mysql');
const config = require('../config/default');

let index = async (ctx, next) => {
    await ctx.render('admin');
}

let submit = async (ctx, next) => {
    let input = ctx.request.body.input;

    let sql = "INSERT INTO codes (contents, created_at, updated_at) VALUES (?, ?, ?)";

    let time = parseInt(Date.parse(new Date()) / 1000)
    let sqlResult = await mysql.query(sql, [input, time, time]);
    console.log(sqlResult.insertId);
    let url = `${config.url}/${sqlResult.insertId}`;

    let result = {
        url
    }

    ctx.response.body = JSON.stringify(result);
}

module.exports = {
    'GET /admin': index,
    'POST /admin/submit': submit
}