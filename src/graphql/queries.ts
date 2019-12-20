// tslint:disable
// this is an auto generated file. This will be overwritten

export const getVideoStorage = `query GetVideoStorage($videoKey: String!) {
  getVideoStorage(videoKey: $videoKey) {
    username
    videoKey
    videoDesc
    videoTitle
    thumbKey
    category
    tags
    likes
    dislikes
    views
    createdAt
    editedAt
    ammountComments
  }
}
`;
export const listVideoStorages = `query ListVideoStorages(
  $filter: TableVideoStorageFilterInput
  $limit: Int
  $nextToken: String
) {
  listVideoStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      username
      videoKey
      videoDesc
      videoTitle
      thumbKey
      category
      tags
      likes
      dislikes
      views
      createdAt
      editedAt
      ammountComments
    }
    nextToken
  }
}
`;
export const getUserStorage = `query GetUserStorage($username: String!) {
  getUserStorage(username: $username) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const listUserStorages = `query ListUserStorages(
  $filter: TableUserStorageFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      username
      likedVideos
      dislikedVideos
    }
    nextToken
  }
}
`;
export const getCommentStorage = `query GetCommentStorage($commentKey: String!, $videoKey: String!) {
  getCommentStorage(commentKey: $commentKey, videoKey: $videoKey) {
    commentKey
    videoKey
    username
    comment
    createdAt
    ammountReplies
    likes
    dislikes
  }
}
`;
export const listCommentStorages = `query ListCommentStorages(
  $filter: TableCommentStorageFilterInput
  $limit: Int
  $nextToken: String
) {
  listCommentStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      commentKey
      videoKey
      username
      comment
      createdAt
      ammountReplies
      likes
      dislikes
    }
    nextToken
  }
}
`;
export const getReplyStorage = `query GetReplyStorage($replyKey: String!, $commentKey: String!) {
  getReplyStorage(replyKey: $replyKey, commentKey: $commentKey) {
    commentKey
    replyKey
    username
    comment
    createdAt
    likes
    dislikes
  }
}
`;
export const listReplyStorages = `query ListReplyStorages(
  $filter: TableReplyStorageFilterInput
  $limit: Int
  $nextToken: String
) {
  listReplyStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      commentKey
      replyKey
      username
      comment
      createdAt
      likes
      dislikes
    }
    nextToken
  }
}
`;
