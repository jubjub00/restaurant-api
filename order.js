
let express = require('express');
const {v4 : uuidv4} = require('./node_modules/uuid');
let config = require('./config');

let table = "order";


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

async function insert_order(req,res) {
    let Items = req.body ;
    if(Items.order_id == null)
        Items.order_id = uuidv4();
    

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

module.exports = {
   read,
   insert_order,
}