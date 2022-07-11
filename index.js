
require('dotenv').config();
const {parse}= require('csv-parse')
const { DynamoDB } = require('aws-sdk');
const AWS = require('aws-sdk');
const { Console } = require('console');
const async = require('async');
const fs= require('fs')
const CSV_FILE = "./results.csv";

const my_AWSAccessKeyId = process.env.AWSAccessKeyId;
const my_AWSSecretKey = process.env.AWSSecretKey;
const aws_region = process.env.region;
const dynamodbTable = process.env.tableName;
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: aws_region,
    accessKeyId: my_AWSAccessKeyId,
    secretAccessKey: my_AWSSecretKey,
});
console.log(dynamoDB)
//const insertDataintoDatabase=async()=>{
    // const params = {
    //     TableName:myTable,
    //     Item:item
    // };
const file = fs.createReadStream(CSV_FILE);
const parser = parse({
  columns: true,
},(err, data)=> {

  const array = [],
  size = 25;   

  while (data.length > 0) {
    array.push(data.splice(0, size));
  }
  console.log(array)
  chunk = 1
  async.each(array,(item_data, callback)=> {
    const params = {
      RequestItems: {}
    };
    params.RequestItems[dynamodbTable] = [];
    item_data.forEach(item => {
      for (key of Object.keys(item)) {
        if (item[key] === '') 
          delete item[key];
      }

      params.RequestItems[dynamodbTable].push({
        PutRequest: {
          Item: 
            {
                "GUID":{"S": "5cd9fee2-7fdd-4418-b2db-361b66dd397f"},
                "Bio": {"S":'express'},
                "consent": {"BOOL":'false'},
                "created_at": {"S":'2022-06-09T11:01:38Z'},
                "Gender": {"S":'female'},
                "LastUpdated_At": {"S":'8:00PM'},
                "location": {"S":'mumbai'},
                "location_access": {"S":'goregaon'},
                "Preferences": {'S':"anything"},
                "username": {"S":'akshita'},
                "work_experience":{"S": '2yrs'}
              }   
        },
        "ReturnConsumedCapacity":"TOTAL",
        "ReturnItemCollectionMetrics":"SIZE"
      })
      
    }); 
    console.log("params",params)
    dynamoDB.BatchWriteItem(params,(err, data)=> {
      console.log('done going next');
      if (err) {
        console.log('Fail chunk');
      } else {
        console.log(err);
        console.log('Success chunk',data);
      }
      chunk++;
      callback();
    });

  },()=> {
    // run after loops
    console.log('all data imported....');

  });
});
file.pipe(parser);
