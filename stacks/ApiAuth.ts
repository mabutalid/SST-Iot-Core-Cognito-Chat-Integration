import * as iam from "aws-cdk-lib/aws-iam";
import { StackContext, use, Api } from "@serverless-stack/resources";
import { MyStack } from "./MyStack";

export const ApiAuthRoutesStack = ({ stack }: StackContext) => {
  if (!process.env.COGNITO_USER_POOL_ID) {
    throw new Error(
      "Undefined ID token lifetime. Please set the ID_TOKEN_LIFETIME environment variable."
    );
  }
  
  if (!process.env.AWS_CONFIG_CLIENT_REGION) {
    throw new Error(
      "Undefined client whitelist. Please set the CLIENT_WHITELIST environment variable."
    );
  }
  
  if (!process.env.AWS_CONFIG_CLIENT_APP_CLIENT_ID) {
    throw new Error(
      "Undefined SMS sender ID. Please set the SMS_FROM environment variable."
    );
  }
  
  if (!process.env.AWS_CONFIG_CLIENT_APP_SECRET) {
    throw new Error(
      "Undefined file type whitelist. Please set the FILE_TYPE_WHITELIST environment variable."
    );
  }

  const { cognitoUserPool } = use(MyStack);

  let environment: Record<string, string> = {
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    AWS_CONFIG_CLIENT_REGION: process.env.AWS_CONFIG_CLIENT_REGION,
    AWS_CONFIG_CLIENT_APP_CLIENT_ID: process.env.AWS_CONFIG_CLIENT_APP_CLIENT_ID,
    AWS_CONFIG_CLIENT_APP_SECRET: process.env.AWS_CONFIG_CLIENT_APP_SECRET,
  };

  let iamActions = [
    "cognito-idp:AdminCreateUser",
    "cognito-idp:AdminInitiateAuth",
    "cognito-idp:AdminRespondToAuthChallenge",
    "cognito-idp:AdminResetUserPassword",
    "cognito-idp:AdminUpdateUserAttributes",
    "cognito-idp:AdminGetUser",
    "cognito-idp:AdminConfirmSignUp",
    "cognito-idp:AdminSetUserPassword",
    "cognito-idp:DescribeUserPoolClient",
  ];

  let allowedResources = [cognitoUserPool.userPoolArn];

  const cognitoIdpPolicy = new iam.PolicyStatement({
    actions: iamActions,
    effect: iam.Effect.ALLOW,
    resources: allowedResources,
  });

  let permissions = [cognitoIdpPolicy];

  const api = new Api(stack, `marco-test-api`, {
    defaults: {
      function: {
        runtime: "nodejs16.x",
        permissions,
        environment,
      },
    },
    routes: {
      "POST /login": "functions/userpoolLogin.main",
      "POST /changePassword": "functions/forceChangePassword.main",
      "POST /getIdentityId": "functions/getIdentityId.main",
      "POST /getAWSTempCreds": "functions/getAWSTempCreds.main",
    },
  });

  stack.addOutputs({
    api: api.url,
  });

  api.attachPermissions(permissions);
};
