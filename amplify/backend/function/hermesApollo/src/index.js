const { ApolloServer, gql } = require("apollo-server-lambda");
const Knex = require("knex");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const client = Knex({
  client: "mysql",
  connection: {
    user: "hermesadmin",
    password: "hermesadmin",
    host: "hermes-mysql.cebtllfy2p70.eu-west-1.rds.amazonaws.com",
    database: "Videos",
  },
});
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  scalar GraphQLDate
  scalar GraphQLDateTime

  type User {
    id: ID
    username: String
    fullName: String
    email: String
    date_of_birth: GraphQLDate
    height: Int
    weight: Int
    team: Boolean
    description: String
    followers: Int
    following: Int
    joined: GraphQLDateTime
  }
  type Query {
    getUser(id: ID): User
    getUserByUsername(username: String): User
  }
  type Mutation {
    addUser(id: ID, username: String, fullName: String, email: String): User
    editUser(
      id: ID
      username: String
      fullName: String
      email: String
      date_of_birth: GraphQLDate
      height: Int
      weight: Int
      team: Boolean
      description: String
    ): User
  }
`;

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await client.from("Users").where({ id }).first();
    },
    getUserByUsername: async (_, { username }) => {
      return await client.from("Users").where({ username }).first();
    },
  },
  Mutation: {
    addUser: async (_, { id, username, fullName, email }) => {
      await client("Users").insert({ id, username, fullName, email });
      return await client.from("Users").where({ id }).first();
    },
    editUser: async (
      _,
      {
        id,
        username,
        fullName,
        email,
        date_of_birth,
        height,
        weight,
        team,
        description,
      }
    ) => {
      let variables = {
        username,
        fullName,
        email,
        date_of_birth,
        height,
        weight,
        team,
        description,
      };
      let filteredVariables = removeEmptyOrNull(variables);
      await client("Users").where("id", "=", id).update(filteredVariables);
      return await client.from("Users").where({ id }).first();
    },
  },
};

const removeEmptyOrNull = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );

  return obj;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

// The `listen` method launches a web server.
exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
