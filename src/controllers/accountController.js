const path = require("path");
const captchapng = require("captchapng");
const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "luoshunqi";

// 暴露出去
exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
};

exports.getImageVcode = (req, res) => {
  const random = parseInt(Math.random() * 9000 + 1000);

  // 将验证码添加到session中
  req.session.vcode = random;

  var p = new captchapng(80, 30, random); // width,height,numeric captcha
  p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

  var img = p.getBase64();
  var imgbase64 = new Buffer(img, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(imgbase64);
};

exports.getRegister = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
}

// 注册
exports.register = (req, res) => {
  // 假设一个状态 注册成功
  const result = { status: 0, message: "注册成功" }

  // console.log(req.body);
  const {username} = req.body
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      const db = client.db(dbName)
      // 获取集合
      const collection = db.collection("accountInfo")
      collection.findOne({username}, (err, doc) => {
        console.log(doc);
        if (doc != null) {
          result.status = 1;
          result.message = "用户名已经存在！";
          // 关闭数据库
          client.close();
          // 返回数据
          res.json(result);
        } else {
          collection.insertOne(req.body, (err, result1) => {
            // 判断插入结果是否失败，如果失败就是null
            if (result1 == null) {
              result.status = 2;
              result.message = "注册失败!";
            }

            client.close();
            res.json(result);
          });
        }
      });
    }
  );
};

exports.login = (req, res) =>{
  // console.log(1);
  // 假设一个登录成功的状态
  const result = {status:0,message:"登录成功" };
  const {username,password,vcode} = req.body;
  console.log(username,password,vcode);

  if (vcode != req.session.vcode) {
    result.result = 1
    result.message = "验证码不正确"
    res.json(result)
    return;
  }

  MongoClient.connect(url,{useNewUrlParser:true},
    function(err, client) {
      const db = client.db(dbName)
      // console.log(db);
      // 获取集合
      const collection = db.collection("accountInfo")
      collection.findOne({username,password},(err,doc) => {
        // console.log(doc)
        if (doc == null) {
          result.status = 2
          result.message = "用户名或密码错误"
        }
        // 关闭数据库
        client.close()
        // 返回数据+
        res.json(result)
        
      })
    })
}
