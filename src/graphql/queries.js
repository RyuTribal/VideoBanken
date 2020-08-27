import { gql } from "apollo-boost";
export const getUser = gql`
  query getUser($id: ID) {
    getUser(id: $id) {
      id
      username
      fullName
      email
      date_of_birth
      height
      weight
      team
      description
      followers
      following
      joined
    }
  }
`;

export const getUserByUsername = gql`
  query getUserByUsername($username: String) {
    getUserByUsername(username: $username) {
      id
      username
      fullName
      email
      date_of_birth
      height
      weight
      team
      description
      followers
      following
      joined
    }
  }
`;
