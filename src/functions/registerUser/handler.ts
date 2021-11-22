import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { apiResponses } from '../common/API_Responses';
import { UserToCreate } from '../common/Models';
import { Cognito } from '../common/Cognito';

import schema from './schema';

const registerUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  
  try {
    
    const user: UserToCreate = event.body;
    
    const registerUser = await Cognito.registerUser(user).catch(error => {
      console.log('Error registering user with cognito', error);
      throw new Object({ error });
    });
    
    return apiResponses._200({ registerUser });

  } catch(e) {
    return apiResponses._400(e);
  }

}

export const main = middyfy(registerUser);
  