import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // Event contains all the information about the event
  // context contains the meta data, can be used with middleware
  
  const { title } = JSON.parse(event.body)
  const now = new Date();
  
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdate: now.toISOString(),
  };

  await dynamodb.put({
    TableName: 'AuctionsTable',
    Item: auction,
  }).promise();

  return {
    statusCode: 201, 
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;