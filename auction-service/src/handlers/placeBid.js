import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'
import { getAuctionById } from './getAuction'
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const auction = await getAuctionById(id);

    if (amount <= auction.highestBid.amount){
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`)
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;

    try {
        const result = dynamodb.update(params).promise();
        updatedAuction = (await result).Attributes;
    } catch(e) {
        console.error(e)
        throw new createError.InternalServerError(e);
    }

    return {
        statusCode: 200, 
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid)