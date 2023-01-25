# SST-Iot-Core-Cognito-Chat-Integration

Simple Iot Core integration with Cognito as authorizer to be able to pub/sub from frontend

## Cognito Integration

1. create user pool & identity pool
2. add user in that user pool
3. create Iam Policy (pub, sub actions)
4. attached that policy to role of the authenticated identity of your identity pool
5. attach principal policy to identity from iot (aws iot attach-policy --target us-east-1:53802f43-4b88-4004-91d8-f958f5d43c83 --policy-name TestPolicy1 --region us-east-1 --profile kroma)
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

AWS_CONFIG_CLIENT_REGION="us-east-1"
AWS_CONFIG_CLIENT_APP_CLIENT_ID="clientId"
AWS_CONFIG_CLIENT_APP_SECRET="appSecretKey"
COGNITO_USER_POOL_ID="poolId"
