const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3({
  params: {Bucket: "mditreportfolio"}
});
const dynamoDB = new AWS.DynamoDB();

app.get('/gallery', (req, res) => {
  const params = {
    TableName: "image-table"
  };
  if(req.get('LastEvaluatedKey') != "null") {
    params.ExclusiveStartKey = req.get('LastEvaluatedKey');
  }
  dynamoDB.scan(params, (err, data) => {
    if(err) {
      console.log(err);
    } else {
      const responseBody = {images: data.Items};
      if(data.LastEvaluatedKey) {
        responseBody.lastEvaluatedKey = data.LastEvaluatedKey;
      }
      res.send(responseBody);
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
