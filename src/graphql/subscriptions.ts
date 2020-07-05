// tslint:disable
// this is an auto generated file. This will be overwritten

export const addMessage = `subscription AddMessage($chatId: Int!) {
  addMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    profileImg
    fullName
    sent
  }
}
`;
export const roomMessage = `subscription RoomMessage($chatId: Int!) {
  roomMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    profileImg
    fullName
    sent
  }
}
`;
export const notificationMessage = `subscription NotificationMessage($chatId: Int!) {
  notificationMessage(chatId: $chatId) {
    chatId
    id
    message
    createdAt
    username
    profileImg
    fullName
    sent
  }
}
`;
export const deleteChatUser = `subscription DeleteChatUser($username: String) {
  deleteChatUser(username: $username) {
    username
    roomId
    id
  }
}
`;
export const detectChangeUser = `subscription DetectChangeUser($roomId: Int) {
  detectChangeUser(roomId: $roomId) {
    username
    roomId
    id
  }
}
`;
