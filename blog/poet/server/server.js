var
  express = require('express'),
  app = express(),
  Poet = require('../lib/poet'),
  MongoStore = require('connect-mongo')(express),
  settings = require('./settings'),
  crypto = require('crypto'),
  User = require('./models/user.js'),
  flash = require('connect-flash'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  Post = require('./models/post.js');

var poet = Poet(app, {
  postsPerPage: 10,
  posts: './_posts',
  metaFormat: 'json',
  routes: {
    '/myposts/:post': 'post',
    '/pagination/:page': 'page',
    '/mytags/:tag': 'tag',
    '/mycategories/:category': 'category'
  }
});

poet.watch(function () {
  // watcher reloaded
}).init().then(function () {
  // Ready to go!
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(app.routes);
app.use(flash());
app.use(bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,                             //cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},   //30 days
  store: new MongoStore({
    db: settings.db
  })
}));

app.get('/', function (req, res) {
    
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(null, page, function (err, posts, total) {
      if (err) {
        posts = [];
      } 

    res.render('index'/*, 
        {title: '主页',
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()}) ;}*/
      );
    });
});

app.get('/posting', function (req, res) { res.render('posting');});
app.post('/posting', function (req, res) {
    var currentUser = req.session.user,
        tags = [req.body.tag1, req.body.tag2, req.body.tag3],
        post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
    post.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', '發布成功!');
      res.redirect('/');//发表成功跳转到主页
    });
  });

app.get('/login', function (req, res) { res.render('login');});

//app.get('/register', checkNotLogin);
app.get('/register', function (req, res) { res.render('register');});

//app.post('/register', checkNotLogin);
app.post('/register', function (req, res) {
/*
  var name = req.body.account,
      password = req.body.password,
      password_check = req.body['password-repeat'];

  //檢查兩次輸入的密碼是否一致
  if (password_check != password) {
    req.flash('error', '兩次輸入的密碼不同'); 
    return res.redirect('/register');
  }

  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });

  //檢查帳號是否已註冊
  User.get(newUser.name, function (err, user) {
    if (user) {
      req.flash('error', '帳號已註冊');
      return res.redirect('/register');
    }
    //如果不存在則新增用戶
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/register'); //註冊失敗則返回註冊頁
      }
      req.session.user = user;            //用户信息存入 session
      req.flash('success', '註冊成功');
      res.redirect('/');                  //註冊成功後返回主頁
    });
  });
*/
  var newUser = new User({
      name: "lens",
      password: "1234",
      email: "lens@gmail.com"
      });

  User.get(newUser.name, function (err, user) {
    if (user) {
      req.flash('error', '帳號已註冊');
      return res.redirect('/register');
    }
    //如果不存在則新增用戶
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/register'); //註冊失敗則返回註冊頁
      }
      req.session.user = user;            //用户信息存入 session
      console.log(user);
      req.flash('success', '註冊成功');
      res.redirect('/');                  //註冊成功後返回主頁
    });
  });
});
/*
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '尚未登入'); 
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已經登入'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}
*/
app.listen(8080);
