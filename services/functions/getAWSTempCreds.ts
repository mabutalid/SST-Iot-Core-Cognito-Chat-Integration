import { getCredentialsForIdentity } from '../core/cognito';

export const main = async (event: any) => {
  console.log('=================HERE GET AWS TEMPORARY CREDS LOGS==========');
  console.log(event.body);

  const payload = JSON.parse(event.body);
  
  console.log('PAYLOAD');
  console.log(payload);

  const { identityId, idToken } = payload;

  const result = await getCredentialsForIdentity(identityId, idToken);

  console.log('======Result======');
  console.log(result);
  
  return result;
};
