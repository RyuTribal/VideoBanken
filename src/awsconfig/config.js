const config = {
  Auth: {
    identityPoolId: "eu-west-1:074e79e2-3122-411a-8a96-9f51675152ff",
    // REQUIRED - Amazon Cognito Region
    region: "eu-west-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-1_QL6GRVJ5q",
    userPoolWebClientId: "7ldqrgm0mqiq8l6pm238118kr4",
    oauth: {
      domain: "hermes-focus.auth.eu-west-1.amazoncognito.com",
      scope: [
        "phone",
        "email",
        "openid",
        "profile",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: "http://localhost:3000/home/",
      redirectSignOut: "http://localhost:3000/login/",
      responseType: "token",
    },
  },
  Storage: {
    AWSS3: {
      bucket: "vod-source-t835rdmjfxx2", //REQUIRED -  Amazon S3 bucket
      region: "eu-west-1", //OPTIONAL -  Amazon service region
    },
  },
  aws_appsync_graphqlEndpoint:
    "https://p5cbrelhdzdy7kxk2b77xaxaai.appsync-api.eu-west-1.amazonaws.com/graphql",
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS", // You have configured Auth with Amazon Cognito User Pool ID and Web Client Id
  // ...
};

export default config;
