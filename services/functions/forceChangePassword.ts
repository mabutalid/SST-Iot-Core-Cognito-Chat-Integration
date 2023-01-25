import { respondToNewPasswordAuthChallenge } from '../core/cognito';

export const main = async (event: any) => {
  console.log('=================HERE FORCE CHANGE PASSWORD LOGS==========');
  console.log(event.body);

  const payload = JSON.parse(event.body);
  
  console.log('PAYLOAD');
  console.log(payload);

  const { session, username, newPassword } = payload;

  const result = await respondToNewPasswordAuthChallenge(session, username, newPassword);

  console.log('======Result======');
  console.log(result);
  
  return event.body;
};
