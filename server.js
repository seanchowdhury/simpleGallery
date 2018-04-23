const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3({
  params: {Bucket: "mditreportfolio"}
});

const docClient = new AWS.DynamoDB.DocumentClient();
const generate = require("adjective-adjective-animal");
const jsonwebtoken = require("jsonwebtoken");


app.get('/gallery', (req, res) => {
  const params = {
    TableName: "image-table"
  };
  if(req.get('LastEvaluatedKey') !== "null") {
    params.ExclusiveStartKey = req.get('LastEvaluatedKey');
  }
  docClient.scan(params, (err, data) => {
    if(err) {
      console.log(err);
    } else {
      const responseBody = {images: data.Items};
      if(data.LastEvaluatedKey) {
        responseBody.lastEvaluatedKey = data.LastEvaluatedKey;
      }
      res.json(responseBody);
    }
  });
});

app.get('/authorize', (req, res) => {
  const params = {
    TableName: "authentication-table",
    KeyConditionExpression: "jwt = :j",
    ExpressionAttributeValues: {
      ":j": req.get('token')
    }
  };
  const deleteParams = {
    TableName: "authentication-table",
    Key: {
      jwt: req.get('token')
    }
  };
  docClient.query(params, (err, data) => {
    if(err) {
      console.log(err);
    } else if(data.Count === 1) {
      docClient.delete(deleteParams, (deleteErr, deleteData) => {
        if(err) {
          console.log(deleteErr);
        } else {
          const jwtParams = {
            letter: data.Items[0].letter,
            curatedImages: data.Items[0].curatedImages
          };
          const token = jsonwebtoken.sign(jwtParams, 'secret');
          res.json(token);
        }
      });
    } else {
      res.json("Unauthorized");
    }
  });
});

app.post('/curate', (req, res) => {
  generate("pascal").then(token => {
    const params = {
      TableName: "authentication-table",
      Item: {
        jwt: token,
        curatedImages: req.body.curatedImages
      }
    };
    if(req.body.letter) {
      params.Item.letter = req.body.letter;
    }
    docClient.put(params, (err, data) => {
      if(err) {
        console.log(err);
      } else {
        res.json(token);
      }
    });
  });
});

app.get('/welcome', (req, res) => {
  const token = req.get('authToken');
  jsonwebtoken.verify(token, 'secret', (err, decoded) => {
    if(err) {
      console.log(err);
    } else {
      res.json({ letter: decoded.letter, curatedImages: decoded.curatedImages });
    }
  });
});

app.get('/checkJWT', (req, res) => {
  const token = req.get('authToken');
  jsonwebtoken.verify(token, 'secret', (err, decoded) => {
    if(err) {
      res.json(false);
    } else {
      res.json(true);
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
