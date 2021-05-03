
let express = require('express');
const {v4 : uuidv4} = require('./node_modules/uuid');
let config = require('./config');

let table = "food";


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
            "food_id": req.params.id
        }
    };

    await config.get(params, function(err, data) {
        if (err) {
            handleError(err, res);
        } else {
            handleSuccess(data, res);
        }
    });  
}
async function insert_food(req,res) {
    let Items = req.body ;
    if(Items.food_id == null)
        Items.food_id = uuidv4();
    

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
async function delete_food(req, res)  {

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

module.exports = {
   search,
   read,
   insert_food,
   delete_food
}