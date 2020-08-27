import { gql } from "apollo-boost";
export const addUser = gql`
  mutation addUser(
    $id: ID!
    $username: String!
    $fullName: String
    $email: String
  ) {
    addUser(id: $id, username: $username, fullName: $fullName, email: $email) {
      id
      username
      fullName
      email
    }
  }
`;

export const editUser = gql`
  mutation editUser(
    $id: ID!
    $username: String
    $fullName: String
    $email: String
    $date_of_birth: GraphQLDate
    $height: Int
    $weight: Int
    $team: Boolean
    $description: String
  ) {
    editUser(
      id: $id
      username: $username
      fullName: $fullName
      email: $email
      date_of_birth: $date_of_birth
      height: $height
      weight: $weight
      team: $team
      description: $description
    ) {
      id
      username
      fullName
      email
      date_of_birth
      height
      weight
      team
      description
    }
  }
`;
