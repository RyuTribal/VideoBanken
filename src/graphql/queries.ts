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
export const getComments = `query GetComments($offset: Int, $input: CommentInput!) {
  getComments(offset: $offset, input: $input) {
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
export const getComment = `query GetComment($input: CommentInput!) {
  getComment(input: $input) {
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
export const getReplies = `query GetReplies($offset: Int, $input: ReplyInput!) {
  getReplies(offset: $offset, input: $input) {
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
export const getReply = `query GetReply($input: ReplyInput!) {
  getReply(input: $input) {
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
export const getUser = `query GetUser($input: UserInput!) {
  getUser(input: $input) {
    username
    likes
    dislikes
    videos
  }
}
`;
