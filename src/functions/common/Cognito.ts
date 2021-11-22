import { UserToCreate } from '../common/Models';

const serverlessConfiguration = require('../../../serverless');
const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

export const Cognito = {
    
    async registerUser(user: UserToCreate) {

        const params = {
          UserPoolId: serverlessConfiguration.custom.userPoolId,
          Username: user.username,
          ClientMetadata: {},
          DesiredDeliveryMediums: [],
          ForceAliasCreation: false,
          MessageAction: "SUPPRESS",
          TemporaryPassword: user.temporaryPassword,
          UserAttributes: [
            {
              Name: 'name',
              Value: user.name
            },
            {
              Name: 'nickname',
              Value: user.nickname
            },
            {
              Name: 'email',
              Value: user.email
            }
          ],
          ValidationData: []
        };

        console.log('params', params);
        
        const registerStatus = await cognitoidentityserviceprovider.adminCreateUser(params).promise();

        return registerStatus;
    }
};