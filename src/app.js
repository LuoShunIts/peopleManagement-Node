// 导入模块
const express = require('express')
const path = require('path')

// 创建app
const app = express();

app.use(express.static(path.join(__dirname,'statics')))

// 请求  处理  响应
const accountRouter = require(path.join(__dirname,"./routers/accountRouter.js"))
app.use('/account',accountRouter)

// 开启web服务
app.listen(3000,'127.0.0.1',err=>{
    if(err){
        console.log(err);
    }
    console.log('开启成功');
})
