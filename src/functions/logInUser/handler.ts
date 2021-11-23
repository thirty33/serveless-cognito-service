import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { apiResponses } from '../common/API_Responses';
import { logInObject } from '../common/Models';
import { Cognito } from '../common/Cognito';

import schema from './schema';

const logInUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  try {
    
    const logInObject: logInObject = event.body;

    const loginUserStatus = await Cognito.signIn(logInObject).catch(error => {
      console.log('Error in sign in proccess', error);
      throw new Object({ error });
    });

    return apiResponses._200({ loginUserStatus });

  } catch(e) {
    return apiResponses._400(e);
  }

}

export const main = middyfy(logInUser);
  