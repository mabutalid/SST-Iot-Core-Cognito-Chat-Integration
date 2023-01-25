import { StackContext } from "@serverless-stack/resources";
import { aws_iot as iot } from 'aws-cdk-lib';

export function TestIotThingStack({ stack }: StackContext) {
  if(!process.env.CERTIFICATE_ARN) {
    throw new Error("Undefined certificate ARN. Please set the CERTIFICATE_ARN environment variable.");
  }

  const certificateArn = process.env.CERTIFICATE_ARN;

  const thing = new iot.CfnThing(stack, "test-iot-thing", {
    thingName: `test-iot-thing-${stack.account}-${stack.region}`,
  });

  if(!thing.thingName) {
    throw new Error("TestIotThingStack: Undefined IOT thing name.");
  }

  const policy = new iot.CfnPolicy(stack, "test-thing-policy", {
    policyName: "TestThingPolicy2",
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: "Allow",
          Action: ["iot:*"],
          Resource: ["*"],
        },
      ],
    },
  });

  if(!policy.policyName) {
    throw new Error("TestIotThingStack: Undefined IOT policy name.");
  }

  const policyPrincipalAttachment = new iot.CfnPolicyPrincipalAttachment(
    stack,
    "TestThingPolicyPrincipalAttachment",
    {
      policyName: policy.policyName,
      principal: certificateArn,
    },
  );

  policyPrincipalAttachment.addDependsOn(policy);

  const thingPrincipalAttachment = new iot.CfnThingPrincipalAttachment(
    stack,
    "TestThingPrincipalAttachment",
    {
      thingName: thing.thingName,
      principal: certificateArn,
    },
  );

  thingPrincipalAttachment.addDependsOn(thing);

  stack.addOutputs({
    ThingName: thing.thingName,
    ThingCertificateArn: certificateArn,
  });

  return { certificateArn, thing };
}