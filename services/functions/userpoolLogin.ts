import { initiateAuth } from '../core/cognito';

export const main = async (event: any) => {
  console.log('=================HERE LOGIN LOGS==========');
  console.log(event.body);

  const payload = JSON.parse(event.body);
  
  console.log('PAYLOAD');
  console.log(payload);

  const { username, password } = payload;

  const result = await initiateAuth(username, password);

  console.log('======Result======');
  console.log(result);
  
  return result;
};
