
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import request from 'superagent'
import queryString from 'queryString'

import * as api from './src/constants/api'

const app = express();

app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'static')));

//安全设置，
//禁用x-powered-by 头
//禁止任何frame,iframe,xss protections

for (let i of Object.keys(api)) {
    fetch(api[i])
}

function fetch(url) {
  app.get(url , (req, res) => {
    let query = queryString.stringify(req.query)
    let uri = 'http://wx.fuxiyi.com' + url + '/index.php?' + query
    let cookie = req.headers.cookie
   
    request.get(uri)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', cookie)
        .end((err, response) => {
            res.send(response.text)
        })
  })
}


module.exports = app;