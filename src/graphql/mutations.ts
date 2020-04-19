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
export const sendView = `mutation SendView($id: ID!) {
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
  }
}
`;
export const sendDislike = `mutation SendDislike($input: VideoDislikesInput!) {
  sendDislike(input: $input) {
    username
    videoID
  }
}
`;
export const sendTag = `mutation SendTag($input: TagInput!) {
  sendTag(input: $input) {
    tag
    videoID
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
    isEdited
    ammountReplies
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
    isEdited
    ammountReplies
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
    isEdited
    ammountReplies
  }
}
`;
export const likeComment = `mutation LikeComment($input: CommentLikeInput!) {
  likeComment(input: $input) {
    username
    commentID
    videoID
  }
}
`;
export const dislikeComment = `mutation DislikeComment($input: CommentDislikeInput!) {
  dislikeComment(input: $input) {
    username
    commentID
    videoID
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
    isEdited
  }
}
`;
export const likeReply = `mutation LikeReply($input: ReplyLikeInput!) {
  likeReply(input: $input) {
    username
    replyID
    commentID
    videoID
  }
}
`;
export const dislikeReply = `mutation DislikeReply($input: ReplyDislikeInput!) {
  dislikeReply(input: $input) {
    username
    replyID
    commentID
    videoID
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
