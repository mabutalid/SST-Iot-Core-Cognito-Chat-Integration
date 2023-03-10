# SST-Iot-Core-Cognito-Chat-Integration

Simple Iot Core integration with Cognito as authorizer to be able to pub/sub from frontend

## Cognito Integration

1. create user pool & identity pool
2. add user in that user pool
3. create Iam Policy (pub, sub actions)
4. attached that policy to role of the authenticated identity of your identity pool
5. attach principal policy to identity from iot (aws iot attach-policy --target {identityId} --policy-name {policyName} --region us-east-1)
6. authenticate with that user from your userpool and receive an idToken
7. exchange that idToken to the Identity Pool (to get temporary aws credentials) (make sure Identity Pool has your user pool as a provider
8. use that credentials for the aws mqtt client

## Use aws-iot-device-sdk in Browser React-Vite

references: https://github.com/aws/aws-iot-device-sdk-js/blob/master/README.md#device (need to run something here script of this lib)

1. npm add node-stdlib-browser & npm add -D vite-plugin-node-stdlib-browser
2. in vite.config.ts:
   - import nodePolyfills from 'vite-plugin-node-stdlib-browser'

- under plugins add this nodePolyfills()

3. install @esbuild-plugins/node-globals-polyfill

## env

- AWS_CONFIG_CLIENT_REGION="us-east-1"
- AWS_CONFIG_CLIENT_APP_CLIENT_ID="clientId"
- AWS_CONFIG_CLIENT_APP_SECRET="appSecretKey"
- COGNITO_USER_POOL_ID="poolId"

## Links references

- https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html
- https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetId.html
- https://github.com/aws/aws-iot-device-sdk-js/blob/master/README.md#device
- https://docs.aws.amazon.com/cli/latest/reference/iot/index.html#cli-aws-iot
- https://www.youtube.com/watch?v=j2KJVHGHaFc
- https://www.youtube.com/watch?v=9pvygKIuCpI
