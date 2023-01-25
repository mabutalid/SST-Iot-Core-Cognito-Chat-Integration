import crypto from 'crypto';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AuthFlowType,
  ChallengeNameType,
  AdminUpdateUserAttributesCommand,
  MessageActionType,
  RevokeTokenCommand,
  DescribeUserPoolClientCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from "@aws-sdk/client-cognito-identity";

import { constants } from '../constants';

const client = new CognitoIdentityProviderClient({
  region: constants.Region,
});

const idpClient = new CognitoIdentityClient({ region: constants.Region });

const createSecretHash = (username: string) => {
  const hmac = crypto.createHmac('sha256', constants.appClientSecret as string);

  const data = hmac.update(username + constants.appClientId);

  return data.digest('base64');
};

export const getIdentityId = async (idToken: string) => {
  return await idpClient.send(new GetIdCommand({
    IdentityPoolId: 'us-east-1:d4a6468f-2768-4f9e-96c6-72915416f1f7',
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_P1P3fiE9d": idToken
    }
  }))
}

export const getCredentialsForIdentity = async (identityId: string, idToken: string) => {
  return await idpClient.send(new GetCredentialsForIdentityCommand({
    IdentityId: identityId,
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_P1P3fiE9d": idToken
    }
  }));
}

export const adminCreateUser = async (email: string, tmpPwd: string) => {
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: constants.UserPoolId,
      Username: email,
      MessageAction: MessageActionType.SUPPRESS,
      TemporaryPassword: tmpPwd,
    });

    await client.send(command);
    return true;
  } catch (err: any) {
    console.log(err);
  }
};

export const initiateAuth = async (username: string, password: string) => {
  try {
    const desribeUserPoolClientCommand = new DescribeUserPoolClientCommand({
      ClientId: constants.appClientId,
      UserPoolId: constants.UserPoolId,
    });

    const clientCommandResult = await client.send(desribeUserPoolClientCommand);

    let cookieAge = 86400;

    if (clientCommandResult.UserPoolClient?.RefreshTokenValidity && clientCommandResult.UserPoolClient.TokenValidityUnits)
      cookieAge =
        clientCommandResult.UserPoolClient.RefreshTokenValidity *
        (clientCommandResult.UserPoolClient.TokenValidityUnits.RefreshToken === 'minutes' ? 60 : 86400);

    const command = new InitiateAuthCommand({
      ClientId: constants.appClientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: createSecretHash(username),
      },
    });

    const authResult = await client.send(command);

    return {
      authResult,
      cookieAge,
    };
  } catch (err: any) {
    console.log('error here ===', err)
  }
};

export const respondToNewPasswordAuthChallenge = async (session: string, username: string, newPassword: string) => {
  try {
    const command = new RespondToAuthChallengeCommand({
      ClientId: constants.appClientId,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      Session: session,
      ChallengeResponses: {
        SECRET_HASH: createSecretHash(username),
        USERNAME: username,
        NEW_PASSWORD: newPassword,
      },
    });

    return await client.send(command);
  } catch (err: any) {
    console.log('error here ===', err)
  }
};

export const adminVerifyEmail = async (username: string) => {
  try {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: constants.UserPoolId,
      Username: username,
      UserAttributes: [{ Name: 'email_verified', Value: 'True' }],
    });

    await client.send(command);
  } catch (err: any) {
    console.log('error here ===', err)
  }
};

export const revokeToken = async (refreshToken: string) => {
  try {
    const command = new RevokeTokenCommand({
      ClientId: constants.appClientId,
      ClientSecret: constants.appClientSecret,
      Token: refreshToken,
    });

    await client.send(command);

    return true;
  } catch (err) {
    console.log('error here ===', err)
  }
};

export const refreshTokens = async (username: string, refreshToken: string) => {
  try {
    const command = new InitiateAuthCommand({
      ClientId: constants.appClientId,
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: createSecretHash(username),
      },
    });

    return await client.send(command);
  } catch (err: any) {
    console.log('error here ===', err)
  }
};
