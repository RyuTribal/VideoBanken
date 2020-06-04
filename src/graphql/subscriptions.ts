// tslint:disable
// this is an auto generated file. This will be overwritten

export const addMessage = `subscription AddMessage($chatId: String!) {
  addMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    profileImg
    fullName
  }
}
`;
export const roomMessage = `subscription RoomMessage($chatId: String!) {
  roomMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    profileImg
    fullName
  }
}
`;
