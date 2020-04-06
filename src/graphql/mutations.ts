// tslint:disable
// this is an auto generated file. This will be overwritten

export const addVideo = `mutation AddVideo($input: VideoInput!) {
  addVideo(input: $input) {
    id
    title
    description
    username
    thumbnail
    category
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
  }
}
`;
export const deleteVideo = `mutation DeleteVideo($input: VideoInput!) {
  deleteVideo(input: $input) {
    id
    title
    description
    username
    thumbnail
    category
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
  }
}
`;
export const editVideo = `mutation EditVideo($input: VideoInput!) {
  editVideo(input: $input) {
    id
    title
    description
    username
    thumbnail
    category
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
  }
}
`;
export const sendView = `mutation SendView($id: ID) {
  sendView(id: $id) {
    id
    title
    description
    username
    thumbnail
    category
    tags
    createdAt
    likes
    dislikes
    views
    ammountComments
  }
}
`;
export const sendLike = `mutation SendLike($input: VideoLikesInput!) {
  sendLike(input: $input) {
    username
    videoID
    conditional
  }
}
`;
export const sendDislike = `mutation SendDislike($input: VideoLikesInput!) {
  sendDislike(input: $input) {
    username
    videoID
    conditional
  }
}
`;
export const addComment = `mutation AddComment($input: CommentInput!) {
  addComment(input: $input) {
    id
    videoID
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
export const deleteComment = `mutation DeleteComment($input: CommentInput!) {
  deleteComment(input: $input) {
    id
    videoID
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
export const editComment = `mutation EditComment($input: CommentInput!) {
  editComment(input: $input) {
    id
    videoID
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
export const likeComment = `mutation LikeComment($input: CommentInput!) {
  likeComment(input: $input) {
    id
    videoID
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
export const dislikeComment = `mutation DislikeComment($input: CommentInput!) {
  dislikeComment(input: $input) {
    id
    videoID
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
export const addReply = `mutation AddReply($input: ReplyInput!) {
  addReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    likes
    dislikes
    isEdited
  }
}
`;
export const deleteReply = `mutation DeleteReply($input: ReplyInput!) {
  deleteReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    likes
    dislikes
    isEdited
  }
}
`;
export const editReply = `mutation EditReply($input: ReplyInput!) {
  editReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    likes
    dislikes
    isEdited
  }
}
`;
export const likeReply = `mutation LikeReply($input: ReplyInput!) {
  likeReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    likes
    dislikes
    isEdited
  }
}
`;
export const dislikeReply = `mutation DislikeReply($input: ReplyInput!) {
  dislikeReply(input: $input) {
    id
    commentID
    username
    videoID
    comment
    createdAt
    likes
    dislikes
    isEdited
  }
}
`;
export const addUser = `mutation AddUser($input: UserInput!) {
  addUser(input: $input) {
    username
    likes
    dislikes
    videos
  }
}
`;
export const editUser = `mutation EditUser($input: UserInput!) {
  editUser(input: $input) {
    username
    likes
    dislikes
    videos
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: UserInput!) {
  deleteUser(input: $input) {
    username
    likes
    dislikes
    videos
  }
}
`;
