let app=require('express')();
const food= require('./food');
const member= require('./member');
const order = require('./order')
const bodyParser = require('./node_modules/body-parser');
let port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/food-all',food.read);
app.get('/food/:id',food.search);
app.post('/food',food.insert_food);
app.post('/food-delete',food.delete_food);
app.get('/member-all',member.read);
app.get('/member/:id',member.search);
app.post('/member',member.insert_member);
app.post('/member-delete',member.delete_member);
app.post('/login',member.login);
app.get('/order',order.read);
app.post('/order',order.insert_order);
app.listen(port,(err)=>{
    if(err) console.log(err)
    else console.log('server running');
})
module.exports = app

