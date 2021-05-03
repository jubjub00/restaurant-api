
let express = require('express');
const {v4 : uuidv4} = require('./node_modules/uuid');
let config = require('./config');

let table = "member";


function handleError(err, res) {
    res.json({ 'message': 'server side error', statusCode: 500, data: null });
}
function handleSuccess(data, res) {
    res.json({ message: 'success', statusCode: 200, data: data })
}
async function read(req, res)  {

    let params = {
        TableName: table,
    };
    let data = await dbRead(params);
    
        if(data){
            handleSuccess(data, res);
        }else{
            handleError(err, res);
        }    
}
async function dbRead(params) {
    let promise = config.scan(params).promise();
    let result = await promise;
    let data = result.Items;
    if (result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey;
        data = data.concat(await dbRead(params));
    }
    return data;
}
async function search(req, res)  {

    let params = {
        TableName: table,
        Key:{
            "member_id": req.params.id
        },
    };

    await config.get(params, function(err, data) {
        if (err) {
            // handleError(err, res);
            res.json({ 'message': err.message, statusCode: err.statusCode, data: err });
        } else {
            handleSuccess(data.Item, res);
        }
    });  
}
async function insert_member(req,res) {
    let Items = req.body ;
    Items.member_id = uuidv4();

    var params = {
        TableName:table,
        Item:Items
    };
    
    await config.put(params, function(err, data) {
        if (err) {
            // handleError(err, res);
            res.json({ 'message': 'server side error', statusCode: 500, data: err });
        } else {
            res.json({ 'message': 'added item', statusCode: 200, data: 1 });
        }
    });  
}
async function delete_member(req, res)  {

    let params = {
        TableName: table,
        Key:req.body
    };

    await config.delete(params, function(err, data) {
        if (err) {
            res.json({ 'message': 'server side error', statusCode: 500, data: err });
        } else {
            res.json({ 'message': 'added item', statusCode: 200, data: 1 });
        }
    });  
}

async function login(req, res)  {

    let params = {
        TableName: table,
        
    };
    let promise = config.scan(params).promise();
    let result = await promise;
    let data = result.Items;
    
    let s = null;
    data.forEach(d=>{
        if(d.member_username === req.body.member_username && d.member_password === req.body.member_password){
            s = d
        }
        
    })
    if(s){
        handleSuccess(s, res);
    }else{
        res.json({ 'message': 'error authentication', statusCode: 500, data: s });
    }
    
}
module.exports = {
   search,
   read,
   insert_member,
   delete_member,
   login
}