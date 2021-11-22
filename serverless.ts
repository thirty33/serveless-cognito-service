import type { AWS } from '@serverless/typescript';
import registerUser from '@functions/registerUser';

const serverlessConfiguration: AWS = {
  service: 'cognito-service',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    profile: 'ServelessAccount',
    stage: 'dev',
    region: 'us-east-1',
    iamRoleStatements: [
      { 
        Effect: 'Allow',
        Action: ['cognito-idp:AdminCreateUser'],
        Resource: '*' 
      },
    ]

  },
  // import the function via paths
  functions: { registerUser },
  package: { individually: true },
  custom: {
    userPoolId: 'us-east-1_5h9npWAGZ',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: 'user-pool-test',
          UsernameAttributes: [
            'email'
          ],
          AutoVerifiedAttributes: [
            'email'
          ]
        }
      },
      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'user-pool-client',
          UserPoolId: {
            Ref: 'CognitoUserPool'
          },
          ExplicitAuthFlows: [
            'ADMIN_NO_SRP_AUTH'
          ],
          GenerateSecret: false
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
