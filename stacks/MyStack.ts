import { StackContext, Function, Cognito } from "@serverless-stack/resources";;
import * as iot from 'aws-cdk-lib/aws-iot';
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";

export function MyStack({ stack }: StackContext) {
  const func = new Function(stack, 'SampleFunction', {
    handler: 'functions/lambda.main'
  });

  const iotRule = new iot.CfnTopicRule(stack, 'SampleIotMessageRule', {
    topicRulePayload: {
      actions: [{
        lambda: {
          functionArn: func.functionArn,
        }
      }],
      sql: `SELECT * FROM 'esp32/pub'`,
    }
  });

  func.addPermission('AllowIoTInvoke', {
    principal: new iam.ServicePrincipal('iot.amazonaws.com'),
    sourceArn: iotRule.attrArn,
  });

  
  const cognitoUserPool = new Cognito(stack, "Auth", {
    login: ["username"],
    cdk: {
      userPoolClient: {
        authFlows: {
          userPassword: true,
          adminUserPassword: true,
        },
        generateSecret: true,
      },
      userPool: {
        autoVerify: { email: false, phone: false },
        mfa: cognito.Mfa.OFF,
      },
      
    },
  });
  
  cognitoUserPool.attachPermissionsForAuthUsers(cognitoUserPool, ['iot']);

  return { cognitoUserPool };
};

