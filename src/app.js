// 导入模块
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

// 创建app
const app = express();

// 请求静态资源
app.use(express.static(path.join(__dirname,'statics')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Use the session middleware
app.use(session({ secret: 'keyboard cat',resave:false,saveUninitialized:true, cookie: { maxAge: 10 * 60000 }}))

// 集成路由中间件
const accountRouter = require(path.join(__dirname,"./routers/accountRouter.js"))
const studentManagerRouter = require(path.join(__dirname,"./routers/studentManagerRouter"))
app.use('/account',accountRouter)
app.use('/studentmanager',studentManagerRouter)




// 开启web服务
app.listen(3000,'127.0.0.1',err=>{
    if(err){
        console.log(err);
    }
    console.log('开启成功');
})
