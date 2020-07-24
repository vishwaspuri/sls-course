import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // Event contains all the information about the event
  // context contains the meta data, can be used with middleware
  
  const { title } = event.body;
  const now = new Date();
  
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdate: now.toISOString(),
  };

  try{
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 201, 
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction)