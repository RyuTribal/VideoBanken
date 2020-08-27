import awsExports from "./aws-exports";
import ApolloClient from "apollo-boost";
const { endpoint } = awsExports.aws_cloud_logic_custom[0];
const client = new ApolloClient({
  uri: `${endpoint}/graphql`,
});
export default client;
