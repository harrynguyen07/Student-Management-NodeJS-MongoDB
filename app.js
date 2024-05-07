const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// tạo đối tượng express
const app = express();
const port = 80;
const hostname = '127.0.0.1';

// chỉ định thư viện dùng layout
app.use(ejsLayout)

// chỉ định thư mục chứa template views
app.set('views', './views');

// chỉ định views engine
app.set('view engine', 'ejs');

// chỉ định thư mục publish chứa file css, js, images,...
app.use(express.static(path.join(__dirname, 'public')));
// console.log(path.join(__dirname, 'public'))

// đặt bodyParser trước app.use('/', studentRouter);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: 'con gà đang ăn thóc',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

const studentRouter = require('./routers/StudentRouter');
const subjectRouter = require('./routers/SubjectRouter');
const registerRouter = require('./routers/RegisterRouter');
app.use('/', studentRouter);
app.use('/subject', subjectRouter);
app.use('/register', registerRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${hostname} ${port}`);
});