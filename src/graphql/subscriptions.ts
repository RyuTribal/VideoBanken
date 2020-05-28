// tslint:disable
// this is an auto generated file. This will be overwritten

export const addMessage = `subscription AddMessage($chatId: String!) {
  addMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    userInfo {
      username
      fullName
      email
      profileImg
      coverImg
      date_of_birth
      height
      weight
      team
      description
      followers
      following
    }
  }
}
`;
