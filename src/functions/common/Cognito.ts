import { UserToCreate, logInObject } from '../common/Models';
import { 
  MESSAGE_ACTION, 
  USER_ATTRIBUTES_NAME,
  USER_ATTRIBUTES_NICKNAME,
  USER_ATTRIBUTES_EMAIL,
  AUTH_FLOW,
  CHALLENGE_NAME  
} from '../common/Constants';

const serverlessConfiguration = require('../../../serverless');
const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

export const Cognito = {
    
    async registerUser(user: UserToCreate) {

        const params = {
          UserPoolId: serverlessConfiguration.custom.userPoolId,
          Username: user.email,
          ClientMetadata: {},
          DesiredDeliveryMediums: [],
          ForceAliasCreation: false,
          MessageAction: MESSAGE_ACTION,
          TemporaryPassword: user.temporaryPassword,
          UserAttributes: [
            {
              Name: USER_ATTRIBUTES_NAME,
              Value: user.name
            },
            {
              Name: USER_ATTRIBUTES_NICKNAME,
              Value: user.nickname
            },
            {
              Name: USER_ATTRIBUTES_EMAIL,
              Value: user.email
            }
          ],
          ValidationData: []
        };

        console.log('params', params);
        
        //create user
        const registerStatus = await cognitoidentityserviceprovider.adminCreateUser(params).promise();

        //init auth to change password status
        const initAuthResponse = await cognitoidentityserviceprovider.adminInitiateAuth({
          AuthFlow: AUTH_FLOW,
          ClientId: serverlessConfiguration.custom.userPoolClientId,
          UserPoolId: serverlessConfiguration.custom.userPoolId,
          AuthParameters: {
            USERNAME: user.email,
            PASSWORD: user.temporaryPassword
          }
        }).promise();

        //change password status
        let authChallengeResponse = null;
        if (initAuthResponse?.ChallengeName === CHALLENGE_NAME) {
          authChallengeResponse = await cognitoidentityserviceprovider.adminRespondToAuthChallenge({
            ChallengeName: CHALLENGE_NAME,
            ClientId: serverlessConfiguration.custom.userPoolClientId,
            UserPoolId: serverlessConfiguration.custom.userPoolId,
            ChallengeResponses: {
              USERNAME: user.email,
              NEW_PASSWORD: user.temporaryPassword,
            },
            Session: initAuthResponse.Session
          }).promise();
        }

        return {
          ...registerStatus,
          ...initAuthResponse,
          ...authChallengeResponse
        };
    },

    async signIn(logInObject: logInObject) {
      
      const signInResponse =  await cognitoidentityserviceprovider.adminInitiateAuth({
        AuthFlow: AUTH_FLOW,
        ClientId: serverlessConfiguration.custom.userPoolClientId,
        UserPoolId: serverlessConfiguration.custom.userPoolId,
        AuthParameters: {
          USERNAME: logInObject.email,
          PASSWORD: logInObject.password
        }
      }).promise();

      return signInResponse;
    }
};