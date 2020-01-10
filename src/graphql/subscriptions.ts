// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateVideoStorage = `subscription OnCreateVideoStorage(
  $username: String
  $videoKey: String
  $videoTitle: String
  $category: String
  $thumbKey: String
) {
  onCreateVideoStorage(
    username: $username
    videoKey: $videoKey
    videoTitle: $videoTitle
    category: $category
    thumbKey: $thumbKey
  ) {
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
export const onUpdateVideoStorage = `subscription OnUpdateVideoStorage(
  $username: String
  $videoKey: String
  $videoTitle: String
  $category: String
  $thumbKey: String
) {
  onUpdateVideoStorage(
    username: $username
    videoKey: $videoKey
    videoTitle: $videoTitle
    category: $category
    thumbKey: $thumbKey
  ) {
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
export const onDeleteVideoStorage = `subscription OnDeleteVideoStorage(
  $username: String
  $videoKey: String
  $videoTitle: String
  $category: String
  $thumbKey: String
) {
  onDeleteVideoStorage(
    username: $username
    videoKey: $videoKey
    videoTitle: $videoTitle
    category: $category
    thumbKey: $thumbKey
  ) {
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
export const onCreateUserStorage = `subscription OnCreateUserStorage($username: String) {
  onCreateUserStorage(username: $username) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const onUpdateUserStorage = `subscription OnUpdateUserStorage($username: String) {
  onUpdateUserStorage(username: $username) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const onDeleteUserStorage = `subscription OnDeleteUserStorage($username: String) {
  onDeleteUserStorage(username: $username) {
    username
    likedVideos
    dislikedVideos
  }
}
`;
export const onCreateCommentStorage = `subscription OnCreateCommentStorage(
  $commentKey: String
  $videoKey: String
  $username: String
  $comment: String
  $createdAt: AWSDate
) {
  onCreateCommentStorage(
    commentKey: $commentKey
    videoKey: $videoKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
export const onUpdateCommentStorage = `subscription OnUpdateCommentStorage(
  $commentKey: String
  $videoKey: String
  $username: String
  $comment: String
  $createdAt: AWSDate
) {
  onUpdateCommentStorage(
    commentKey: $commentKey
    videoKey: $videoKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
export const onDeleteCommentStorage = `subscription OnDeleteCommentStorage(
  $commentKey: String
  $videoKey: String
  $username: String
  $comment: String
  $createdAt: AWSDate
) {
  onDeleteCommentStorage(
    commentKey: $commentKey
    videoKey: $videoKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
export const onCreateReplyStorage = `subscription OnCreateReplyStorage(
  $commentKey: String
  $replyKey: String
  $username: String
  $comment: String
  $createdAt: AWSDateTime
) {
  onCreateReplyStorage(
    commentKey: $commentKey
    replyKey: $replyKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
export const onUpdateReplyStorage = `subscription OnUpdateReplyStorage(
  $commentKey: String
  $replyKey: String
  $username: String
  $comment: String
  $createdAt: AWSDateTime
) {
  onUpdateReplyStorage(
    commentKey: $commentKey
    replyKey: $replyKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
export const onDeleteReplyStorage = `subscription OnDeleteReplyStorage(
  $commentKey: String
  $replyKey: String
  $username: String
  $comment: String
  $createdAt: AWSDateTime
) {
  onDeleteReplyStorage(
    commentKey: $commentKey
    replyKey: $replyKey
    username: $username
    comment: $comment
    createdAt: $createdAt
  ) {
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
