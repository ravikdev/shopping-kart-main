'use strict';

import { lambdaHandler } from '../../app.mjs';
import { expect } from 'chai';
var event={
  resource: '/inventory/{id}',
  path: '/inventory/11',
  httpMethod: 'GET',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '17917',
    'CloudFront-Viewer-Country': 'IN',
    Host: 'si9buck60e.execute-api.us-east-1.amazonaws.com',
    'Postman-Token': '742f71f7-216b-47f6-9803-4c3990d50a7f',
    'User-Agent': 'PostmanRuntime/7.51.1',
    Via: '1.1 8ca0754e87dbd92854586a9c822eeb2c.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'oY16CB3mC2hGJ_s5G27kE7v4q2-aeazWJeO1e1dE60BlcD0FOt7jPg==',
    'X-Amzn-Trace-Id': 'Root=1-69b783d7-26e3b3ed1887fe8261a19892',
    'X-Forwarded-For': '49.156.75.221, 130.176.188.178',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '*/*' ],
    'Accept-Encoding': [ 'gzip, deflate, br' ],
    'Cache-Control': [ 'no-cache' ],
    'CloudFront-Forwarded-Proto': [ 'https' ],
    'CloudFront-Is-Desktop-Viewer': [ 'true' ],
    'CloudFront-Is-Mobile-Viewer': [ 'false' ],
    'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
    'CloudFront-Is-Tablet-Viewer': [ 'false' ],
    'CloudFront-Viewer-ASN': [ '17917' ],
    'CloudFront-Viewer-Country': [ 'IN' ],
    Host: [ 'si9buck60e.execute-api.us-east-1.amazonaws.com' ],
    'Postman-Token': [ '742f71f7-216b-47f6-9803-4c3990d50a7f' ],
    'User-Agent': [ 'PostmanRuntime/7.51.1' ],
    Via: [
      '1.1 8ca0754e87dbd92854586a9c822eeb2c.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': [ 'oY16CB3mC2hGJ_s5G27kE7v4q2-aeazWJeO1e1dE60BlcD0FOt7jPg==' ],
    'X-Amzn-Trace-Id': [ 'Root=1-69b783d7-26e3b3ed1887fe8261a19892' ],
    'X-Forwarded-For': [ '49.156.75.221, 130.176.188.178' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: { quantity: '1' },
  multiValueQueryStringParameters: { quantity: [ '10' ] },
  pathParameters: { id: '1' },
  stageVariables: null,
  requestContext: {
    resourceId: '25449k',
    resourcePath: '/inventory/{id}',
    httpMethod: 'GET',
    extendedRequestId: 'aTGJzHEfoAMEC9Q=',
    requestTime: '16/Mar/2026:04:15:19 +0000',
    path: '/Prod/inventory/11',
    accountId: '654654150628',
    protocol: 'HTTP/1.1',
    stage: 'Prod',
    domainPrefix: 'si9buck60e',
    requestTimeEpoch: 1773634519946,
    requestId: '9b2ed0e4-285a-4d05-b9d7-b7226e9920e2',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '49.156.75.221',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'PostmanRuntime/7.51.1',
      user: null
    },
    domainName: 'si9buck60e.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'jl3l2h',
    apiId: 'si9buck60e'
  },
  body: null,
  isBase64Encoded: false
}
, context;
describe('Inventory Lambda tests', function () {
  this.timeout(5000);

  it('returns OutOfStock for product id 9 when DB stock is 0', async () => {
    event.pathParameters.id = '9';
    event.queryStringParameters = { quantity: '1' };

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(409);
    expect(result.body).to.be.a('string');

    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Out of stock: Product id = 9');
  });

  it('returns success for product id 32 with stock 1', async () => {
    event.pathParameters.id = '32';
    event.queryStringParameters = { quantity: '1' };

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');

    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.product_id).to.equal(32);
    expect(response.stock).to.equal(10);
  });

  it('returns 404 for invalid product id 6', async () => {
    event.pathParameters.id = '6';
    event.queryStringParameters = { quantity: '1' };

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(404);
    expect(result.body).to.be.a('string');

    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Invalid product: Product id = 6');
  });
  
  it('returns 404 for invalid product id 6', async () => {
    event.pathParameters.id = '6';
    event.httpMethod = 'POST';
    // event.queryStringParameters = { quantity: '1' };
    event.body = JSON.stringify({ stock: 10 });

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(404);
    expect(result.body).to.be.a('string');

    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Invalid product: Product id = 6');
  });

  it('returns 404 for invalid product id 6', async () => {
    event.pathParameters.id = '6';
    event.httpMethod = 'PUT';
    // event.queryStringParameters = { quantity: '1' };
    event.body = JSON.stringify({ stock: 10 });

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(404);
    expect(result.body).to.be.a('string');

    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Invalid product: Product id = 6');
  });

  it('Updates inventory for valid product id', async () => {
    event.pathParameters.id = '32';
    event.httpMethod = 'PUT';
    // event.queryStringParameters = { quantity: '1' };
    event.body = JSON.stringify({ stock: 10 });

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');

    console.log(result);
    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Inventory updated successfully');
  });

  it('Creates inventory for valid product id', async () => {
    event.pathParameters.id = '104';
    event.httpMethod = 'POST';
    // event.queryStringParameters = { quantity: '1' };
    event.body = JSON.stringify({ stock: 10 });

    const result = await lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');

    // console.log(result);
    const response = JSON.parse(result.body);
    expect(response).to.be.an('object');
    expect(response.message).to.equal('Inventory created successfully');
    expect(response.product_id).to.equal(104);
    expect(response.stock).to.equal(10);
  });
});
