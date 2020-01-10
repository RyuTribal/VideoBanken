// tslint:disable
// this is an auto generated file. This will be overwritten

export const createVideoStorage = `mutation CreateVideoStorage($input: CreateVideoStorageInput!) {
  createVideoStorage(input: $input) {
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
export const updateVideoStorage = `mutation UpdateVideoStorage($input: UpdateVideoStorageInput!) {
  updateVideoStorage(input: $input) {
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
export const deleteVideoStorage = `mutation DeleteVideoStorage($input: DeleteVideoStorageInput!) {
  deleteVideoStorage(input: $input) {
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
export const createUserStorage = `mutation CreateUserStorage($input: CreateUserStorageInput!) {
  createUserStorage(input: $input) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const updateUserStorage = `mutation UpdateUserStorage($input: UpdateUserStorageInput!) {
  updateUserStorage(input: $input) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const deleteUserStorage = `mutation DeleteUserStorage($input: DeleteUserStorageInput!) {
  deleteUserStorage(input: $input) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const createCommentStorage = `mutation CreateCommentStorage($input: CreateCommentStorageInput!) {
  createCommentStorage(input: $input) {
    commentKey
    videoKey
    username
    comment
    createdAt
    ammountReplies
    likes
    dislikes
    isEdited
  }
}
`;
export const updateCommentStorage = `mutation UpdateCommentStorage($input: UpdateCommentStorageInput!) {
  updateCommentStorage(input: $input) {
    commentKey
    videoKey
    username
    comment
    createdAt
    ammountReplies
    likes
    dislikes
    isEdited
  }
}
`;
export const deleteCommentStorage = `mutation DeleteCommentStorage($input: DeleteCommentStorageInput!) {
  deleteCommentStorage(input: $input) {
    commentKey
    videoKey
    username
    comment
    createdAt
    ammountReplies
    likes
    dislikes
    isEdited
  }
}
`;
export const createReplyStorage = `mutation CreateReplyStorage($input: CreateReplyStorageInput!) {
  createReplyStorage(input: $input) {
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
export const updateReplyStorage = `mutation UpdateReplyStorage($input: UpdateReplyStorageInput!) {
  updateReplyStorage(input: $input) {
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
export const deleteReplyStorage = `mutation DeleteReplyStorage($input: DeleteReplyStorageInput!) {
  deleteReplyStorage(input: $input) {
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
