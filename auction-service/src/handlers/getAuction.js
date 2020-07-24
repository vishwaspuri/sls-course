import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auction;
    const { id } = event.pathParameters;

    try{
        const result = await dynamodb.get({
            TableName:  process.env.AUCTIONS_TABLE_NAME,
            Key:    { id }
        }).promise();
        auction = result.Item;
    }   catch(e)    {
        console.error(e);
        throw new createError.InternalServerError(e);
    }
    if (!auction){
        throw new createError.NotFound(`Auction with ID "${id}" not found!`)
    }
    return {
        statusCode: 200, 
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction)
//   .use(httpJsonBodyParser()) // Automatically parses event/ context so that we don't have to use JSON parser
//   .use(httpEventNormalizer())
//   .use(httpErrorHandler());
  