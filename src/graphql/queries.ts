// tslint:disable
// this is an auto generated file. This will be overwritten

export const getVideos = `query GetVideos($offset: Int) {
  getVideos(offset: $offset) {
    id
    title
    description
    username
    thumbnail
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
    connection
  }
}
`;
export const getVideo = `query GetVideo($input: VideoInput!) {
  getVideo(input: $input) {
    id
    title
    description
    username
    thumbnail
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
    connection
  }
}
`;
export const getUserUploads = `query GetUserUploads($username: String, $offset: Int) {
  getUserUploads(username: $username, offset: $offset) {
    id
    title
    description
    username
    thumbnail
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
    connection
  }
}
`;
export const getVideoSize = `query GetVideoSize($guid: ID) {
  getVideoSize(guid: $guid) {
    guid
    srcHeight
    workflowStatus
  }
}
`;
export const getConnections = `query GetConnections($id: Int) {
  getConnections(id: $id) {
    id
    title
    description
    username
    thumbnail
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
    connection
  }
}
`;
export const getLikes = `query GetLikes($videoID: ID!) {
  getLikes(videoID: $videoID) {
    username
    videoID
  }
}
`;
export const getDislikes = `query GetDislikes($videoID: ID!) {
  getDislikes(videoID: $videoID) {
    username
    videoID
  }
}
`;
export const getTags = `query GetTags($input: TagInput!) {
  getTags(input: $input) {
    tag
    videoID
  }
}
`;
export const getComments = `query GetComments($offset: Int, $input: CommentInput!) {
  getComments(offset: $offset, input: $input) {
    id
    videoID
    username
    comment
    createdAt
    isEdited
    ammountReplies
  }
}
`;
export const getCommentLikes = `query GetCommentLikes($commentID: ID!) {
  getCommentLikes(commentID: $commentID) {
    username
    commentID
    videoID
  }
}
`;
export const getCommentDislikes = `query GetCommentDislikes($commentID: ID!) {
  getCommentDislikes(commentID: $commentID) {
    username
    commentID
    videoID
  }
}
`;
export const getComment = `query GetComment($input: CommentInput!) {
  getComment(input: $input) {
    id
    videoID
    username
    comment
    createdAt
    isEdited
    ammountReplies
  }
}
`;
export const getReplies = `query GetReplies($offset: Int, $input: ReplyInput!) {
  getReplies(offset: $offset, input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    isEdited
  }
}
`;
export const getReply = `query GetReply($input: ReplyInput!) {
  getReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    isEdited
  }
}
`;
export const getReplyLikes = `query GetReplyLikes($replyID: ID!) {
  getReplyLikes(replyID: $replyID) {
    username
    replyID
    commentID
    videoID
  }
}
`;
export const getReplyDislikes = `query GetReplyDislikes($replyID: ID!) {
  getReplyDislikes(replyID: $replyID) {
    username
    replyID
    commentID
    videoID
  }
}
`;
export const getUser = `query GetUser($username: String) {
  getUser(username: $username) {
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
`;
export const searchUsers = `query SearchUsers($query: String) {
  searchUsers(query: $query) {
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
`;
export const getMessages = `query GetMessages($id: Int) {
  getMessages(id: $id) {
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
export const getLastMessage = `query GetLastMessage($chatId: Int) {
  getLastMessage(chatId: $chatId) {
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
export const getRooms = `query GetRooms($username: String!) {
  getRooms(username: $username) {
    title
    chatImg
    roomId
    users
  }
}
`;
export const getUnreadMessages = `query GetUnreadMessages($username: String!) {
  getUnreadMessages(username: $username) {
    id
    recepient_username
    recepient_group_id
    message_id
    isRead
  }
}
`;
export const getUnreadMessage = `query GetUnreadMessage($id: Int!, $username: String!) {
  getUnreadMessage(id: $id, username: $username) {
    id
    recepient_username
    recepient_group_id
    message_id
    isRead
  }
}
`;
