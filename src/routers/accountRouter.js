// 导入express
const express = require('express')
const path = require('path')

// 创建路由对象
const accountRouter = express.Router()

const accountCTRL = require(path.join(__dirname,'../controllers/accountController.js'))

accountRouter.get('/login',accountCTRL.getLoginPage)
accountRouter.get('/vcode',accountCTRL.getImageVcode)

module.exports = accountRouter