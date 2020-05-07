// tslint:disable
// this is an auto generated file. This will be overwritten

export const getVideos = `query GetVideos($offset: Int) {
  getVideos(offset: $offset) {
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
export const getVideo = `query GetVideo($input: VideoInput!) {
  getVideo(input: $input) {
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
  }
}
`;
