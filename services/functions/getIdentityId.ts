import { getIdentityId } from '../core/cognito';

export const main = async (event: any) => {
  console.log('=================HERE GET IDENTITY ID LOGS==========');
  console.log(event.body);

  const payload = JSON.parse(event.body);
  
  console.log('PAYLOAD');
  console.log(payload);

  const { idToken } = payload;

  const result = await getIdentityId(idToken);

  console.log('======Result======');
  console.log(result);
  
  return result;
};
