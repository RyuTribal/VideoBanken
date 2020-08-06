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
export const detectRoomChange = `subscription DetectRoomChange($id: Int) {
  detectRoomChange(id: $id) {
    id
    name
    createdAt
    chatImg
  }
}
`;
export const detectFollower = `subscription DetectFollower($username: String) {
  detectFollower(username: $username) {
    username
    follows
  }
}
`;
export const detectFollows = `subscription DetectFollows($follows: String) {
  detectFollows(follows: $follows) {
    username
    follows
  }
}
`;
export const deleteFollower = `subscription DeleteFollower($username: String) {
  deleteFollower(username: $username) {
    username
    follows
  }
}
`;
export const deleteFollows = `subscription DeleteFollows($follows: String) {
  deleteFollows(follows: $follows) {
    username
    follows
  }
}
`;
