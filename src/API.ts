/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type VideoInput = {
  id?: string | null,
  title?: string | null,
  description?: string | null,
  username?: string | null,
  thumbnail?: string | null,
  category?: string | null,
  tags?: string | null,
  likes?: number | null,
  dislikes?: number | null,
  views?: number | null,
  createdAt?: string | null,
  connection?: string | null,
};

export type VideoLikesInput = {
  username?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type VideoDislikesInput = {
  username?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type TagInput = {
  tags?: string | null,
  conditional?: string | null,
  videoID?: string | null,
};

export type CommentInput = {
  id?: number | null,
  videoID?: number | null,
  username?: string | null,
  createdAt?: string | null,
  comment?: string | null,
};

export type CommentLikeInput = {
  username?: string | null,
  commentID?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type CommentDislikeInput = {
  username?: string | null,
  commentID?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type ReplyInput = {
  id?: number | null,
  commentID?: number | null,
  videoID?: number | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
  isEdited?: boolean | null,
};

export type ReplyLikeInput = {
  username?: string | null,
  replyID?: string | null,
  commentID?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type ReplyDislikeInput = {
  username?: string | null,
  replyID?: string | null,
  commentID?: string | null,
  videoID?: string | null,
  conditional?: string | null,
};

export type UserInput = {
  username?: string | null,
  fullName?: string | null,
  email?: string | null,
  profileImg?: string | null,
  coverImg?: string | null,
  date_of_birth?: string | null,
};

export type GetTableIncrementMutationVariables = {
  table?: string | null,
};

export type GetTableIncrementMutation = {
  getTableIncrement:  {
    __typename: "VideoIncrement",
    id: number | null,
  } | null,
};

export type AddVideoMutationVariables = {
  input: VideoInput,
};

export type AddVideoMutation = {
  addVideo:  {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null,
};

export type DeleteVideoMutationVariables = {
  input: VideoInput,
};

export type DeleteVideoMutation = {
  deleteVideo:  {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null,
};

export type EditVideoMutationVariables = {
  input: VideoInput,
};

export type EditVideoMutation = {
  editVideo:  {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null,
};

export type SendViewMutationVariables = {
  id: string,
};

export type SendViewMutation = {
  sendView:  {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null,
};

export type SendLikeMutationVariables = {
  input: VideoLikesInput,
};

export type SendLikeMutation = {
  sendLike:  {
    __typename: "VideoLikes",
    username: string | null,
    videoID: string | null,
  } | null,
};

export type SendDislikeMutationVariables = {
  input: VideoDislikesInput,
};

export type SendDislikeMutation = {
  sendDislike:  {
    __typename: "VideoDislikes",
    username: string | null,
    videoID: string | null,
  } | null,
};

export type SendTagMutationVariables = {
  input: TagInput,
};

export type SendTagMutation = {
  sendTag:  {
    __typename: "Tag",
    tag: string | null,
    videoID: string | null,
  } | null,
};

export type AddCommentMutationVariables = {
  input: CommentInput,
};

export type AddCommentMutation = {
  addComment:  {
    __typename: "Comment",
    id: number | null,
    videoID: number | null,
    username: string | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
    ammountReplies: number | null,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: CommentInput,
};

export type DeleteCommentMutation = {
  deleteComment:  {
    __typename: "Comment",
    id: number | null,
    videoID: number | null,
    username: string | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
    ammountReplies: number | null,
  } | null,
};

export type EditCommentMutationVariables = {
  input: CommentInput,
};

export type EditCommentMutation = {
  editComment:  {
    __typename: "Comment",
    id: number | null,
    videoID: number | null,
    username: string | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
    ammountReplies: number | null,
  } | null,
};

export type LikeCommentMutationVariables = {
  input: CommentLikeInput,
};

export type LikeCommentMutation = {
  likeComment:  {
    __typename: "CommentLikes",
    username: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null,
};

export type DislikeCommentMutationVariables = {
  input: CommentDislikeInput,
};

export type DislikeCommentMutation = {
  dislikeComment:  {
    __typename: "CommentDislikes",
    username: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null,
};

export type AddReplyMutationVariables = {
  input: ReplyInput,
};

export type AddReplyMutation = {
  addReply:  {
    __typename: "Reply",
    id: number | null,
    commentID: number | null,
    username: string | null,
    videoID: number | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
  } | null,
};

export type DeleteReplyMutationVariables = {
  input: ReplyInput,
};

export type DeleteReplyMutation = {
  deleteReply:  {
    __typename: "Reply",
    id: number | null,
    commentID: number | null,
    username: string | null,
    videoID: number | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
  } | null,
};

export type EditReplyMutationVariables = {
  input: ReplyInput,
};

export type EditReplyMutation = {
  editReply:  {
    __typename: "Reply",
    id: number | null,
    commentID: number | null,
    username: string | null,
    videoID: number | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
  } | null,
};

export type LikeReplyMutationVariables = {
  input: ReplyLikeInput,
};

export type LikeReplyMutation = {
  likeReply:  {
    __typename: "ReplyLikes",
    username: string | null,
    replyID: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null,
};

export type DislikeReplyMutationVariables = {
  input: ReplyDislikeInput,
};

export type DislikeReplyMutation = {
  dislikeReply:  {
    __typename: "ReplyDislikes",
    username: string | null,
    replyID: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null,
};

export type AddUserMutationVariables = {
  input: UserInput,
};

export type AddUserMutation = {
  addUser:  {
    __typename: "User",
    username: string | null,
    fullName: string | null,
    email: string | null,
    profileImg: string | null,
    coverImg: string | null,
    date_of_birth: string | null,
    height: number | null,
    weight: number | null,
    team: boolean | null,
    description: string | null,
    followers: number | null,
    following: number | null,
  } | null,
};

export type EditUserMutationVariables = {
  input: UserInput,
};

export type EditUserMutation = {
  editUser:  {
    __typename: "User",
    username: string | null,
    fullName: string | null,
    email: string | null,
    profileImg: string | null,
    coverImg: string | null,
    date_of_birth: string | null,
    height: number | null,
    weight: number | null,
    team: boolean | null,
    description: string | null,
    followers: number | null,
    following: number | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: UserInput,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    username: string | null,
    fullName: string | null,
    email: string | null,
    profileImg: string | null,
    coverImg: string | null,
    date_of_birth: string | null,
    height: number | null,
    weight: number | null,
    team: boolean | null,
    description: string | null,
    followers: number | null,
    following: number | null,
  } | null,
};

export type AddFollowerMutationVariables = {
  username?: string | null,
  follows?: string | null,
};

export type AddFollowerMutation = {
  addFollower:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type RemoveFollowerMutationVariables = {
  username?: string | null,
  follows?: string | null,
};

export type RemoveFollowerMutation = {
  removeFollower:  Array< {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null > | null,
};

export type DetectRemovedFollowerMutationVariables = {
  username?: string | null,
  follows?: string | null,
};

export type DetectRemovedFollowerMutation = {
  detectRemovedFollower:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type CreateMessageMutationVariables = {
  body: string,
  username: string,
  chatId?: number | null,
  profileImg?: string | null,
  fullName: string,
};

export type CreateMessageMutation = {
  createMessage:  {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } | null,
};

export type CreateRoomMutationVariables = {
  users: string,
};

export type CreateRoomMutation = {
  createRoom:  {
    __typename: "Room",
    id: string | null,
    name: string | null,
    createdAt: string | null,
    chatImg: string | null,
  },
};

export type ChangeReadStatusMutationVariables = {
  id: number,
  username: string,
};

export type ChangeReadStatusMutation = {
  changeReadStatus:  {
    __typename: "UnreadMessages",
    id: string | null,
    recepient_username: string | null,
    recepient_group_id: string | null,
    message_id: string | null,
    isRead: boolean | null,
  } | null,
};

export type RemoveChatUserMutationVariables = {
  username: string,
  roomId: number,
};

export type RemoveChatUserMutation = {
  removeChatUser:  {
    __typename: "ChatUsers",
    username: string | null,
    roomId: number | null,
    id: number | null,
  } | null,
};

export type EditChatRoomMutationVariables = {
  title?: string | null,
  chatImg?: string | null,
  roomId?: number | null,
};

export type EditChatRoomMutation = {
  editChatRoom:  {
    __typename: "Room",
    id: string | null,
    name: string | null,
    createdAt: string | null,
    chatImg: string | null,
  } | null,
};

export type GetVideosQueryVariables = {
  offset?: number | null,
};

export type GetVideosQuery = {
  getVideos:  Array< {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null > | null,
};

export type GetVideoQueryVariables = {
  input: VideoInput,
};

export type GetVideoQuery = {
  getVideo:  {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null,
};

export type GetUserUploadsQueryVariables = {
  username?: string | null,
  offset?: number | null,
};

export type GetUserUploadsQuery = {
  getUserUploads:  Array< {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null > | null,
};

export type GetVideoSizeQueryVariables = {
  guid?: string | null,
};

export type GetVideoSizeQuery = {
  getVideoSize:  {
    __typename: "VideoSize",
    guid: string | null,
    srcHeight: number | null,
    workflowStatus: string | null,
  } | null,
};

export type GetConnectionsQueryVariables = {
  id?: number | null,
};

export type GetConnectionsQuery = {
  getConnections:  Array< {
    __typename: "Video",
    id: string,
    title: string | null,
    description: string | null,
    username: string | null,
    thumbnail: string | null,
    tags: string | null,
    createdAt: string | null,
    likes: number | null,
    dislikes: number | null,
    views: number | null,
    ammountComments: number | null,
    connection: string | null,
  } | null > | null,
};

export type GetLikesQueryVariables = {
  videoID: string,
};

export type GetLikesQuery = {
  getLikes:  Array< {
    __typename: "VideoLikes",
    username: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetDislikesQueryVariables = {
  videoID: string,
};

export type GetDislikesQuery = {
  getDislikes:  Array< {
    __typename: "VideoDislikes",
    username: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetTagsQueryVariables = {
  input: TagInput,
};

export type GetTagsQuery = {
  getTags:  {
    __typename: "Tag",
    tag: string | null,
    videoID: string | null,
  } | null,
};

export type GetCommentsQueryVariables = {
  offset?: number | null,
  input: CommentInput,
};

export type GetCommentsQuery = {
  getComments:  Array< {
    __typename: "Comment",
    id: number | null,
    videoID: number | null,
    username: string | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
    ammountReplies: number | null,
  } | null > | null,
};

export type GetCommentLikesQueryVariables = {
  commentID: string,
};

export type GetCommentLikesQuery = {
  getCommentLikes:  Array< {
    __typename: "CommentLikes",
    username: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetCommentDislikesQueryVariables = {
  commentID: string,
};

export type GetCommentDislikesQuery = {
  getCommentDislikes:  Array< {
    __typename: "CommentDislikes",
    username: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetCommentQueryVariables = {
  input: CommentInput,
};

export type GetCommentQuery = {
  getComment:  {
    __typename: "Comment",
    id: number | null,
    videoID: number | null,
    username: string | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
    ammountReplies: number | null,
  } | null,
};

export type GetRepliesQueryVariables = {
  offset?: number | null,
  input: ReplyInput,
};

export type GetRepliesQuery = {
  getReplies:  Array< {
    __typename: "Reply",
    id: number | null,
    commentID: number | null,
    username: string | null,
    videoID: number | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
  } | null > | null,
};

export type GetReplyQueryVariables = {
  input: ReplyInput,
};

export type GetReplyQuery = {
  getReply:  {
    __typename: "Reply",
    id: number | null,
    commentID: number | null,
    username: string | null,
    videoID: number | null,
    comment: string | null,
    createdAt: string | null,
    isEdited: boolean | null,
  } | null,
};

export type GetReplyLikesQueryVariables = {
  replyID: string,
};

export type GetReplyLikesQuery = {
  getReplyLikes:  Array< {
    __typename: "ReplyLikes",
    username: string | null,
    replyID: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetReplyDislikesQueryVariables = {
  replyID: string,
};

export type GetReplyDislikesQuery = {
  getReplyDislikes:  Array< {
    __typename: "ReplyDislikes",
    username: string | null,
    replyID: string | null,
    commentID: string | null,
    videoID: string | null,
  } | null > | null,
};

export type GetUserQueryVariables = {
  username?: string | null,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    username: string | null,
    fullName: string | null,
    email: string | null,
    profileImg: string | null,
    coverImg: string | null,
    date_of_birth: string | null,
    height: number | null,
    weight: number | null,
    team: boolean | null,
    description: string | null,
    followers: number | null,
    following: number | null,
  } | null,
};

export type GetFollowerQueryVariables = {
  username?: string | null,
  follows?: string | null,
};

export type GetFollowerQuery = {
  getFollower:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type GetFollowersQueryVariables = {
  username?: string | null,
};

export type GetFollowersQuery = {
  getFollowers:  Array< {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null > | null,
};

export type GetFollowsQueryVariables = {
  follows?: string | null,
};

export type GetFollowsQuery = {
  getFollows:  Array< {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null > | null,
};

export type SearchUsersQueryVariables = {
  query?: string | null,
};

export type SearchUsersQuery = {
  searchUsers:  Array< {
    __typename: "User",
    username: string | null,
    fullName: string | null,
    email: string | null,
    profileImg: string | null,
    coverImg: string | null,
    date_of_birth: string | null,
    height: number | null,
    weight: number | null,
    team: boolean | null,
    description: string | null,
    followers: number | null,
    following: number | null,
  } | null >,
};

export type GetMessagesQueryVariables = {
  id?: number | null,
};

export type GetMessagesQuery = {
  getMessages:  Array< {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } >,
};

export type GetLastMessageQueryVariables = {
  chatId?: number | null,
};

export type GetLastMessageQuery = {
  getLastMessage:  {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } | null,
};

export type GetRoomsQueryVariables = {
  username: string,
};

export type GetRoomsQuery = {
  getRooms:  Array< {
    __typename: "UserRoom",
    title: string | null,
    chatImg: string | null,
    roomId: number | null,
    users: string | null,
  } | null >,
};

export type GetUnreadMessagesQueryVariables = {
  username: string,
};

export type GetUnreadMessagesQuery = {
  getUnreadMessages:  Array< {
    __typename: "UnreadMessages",
    id: string | null,
    recepient_username: string | null,
    recepient_group_id: string | null,
    message_id: string | null,
    isRead: boolean | null,
  } | null > | null,
};

export type GetUnreadMessageQueryVariables = {
  id: number,
  username: string,
};

export type GetUnreadMessageQuery = {
  getUnreadMessage:  {
    __typename: "UnreadMessages",
    id: string | null,
    recepient_username: string | null,
    recepient_group_id: string | null,
    message_id: string | null,
    isRead: boolean | null,
  } | null,
};

export type AddMessageSubscriptionVariables = {
  chatId: number,
};

export type AddMessageSubscription = {
  addMessage:  {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } | null,
};

export type RoomMessageSubscriptionVariables = {
  chatId: number,
};

export type RoomMessageSubscription = {
  roomMessage:  {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } | null,
};

export type NotificationMessageSubscriptionVariables = {
  chatId: number,
};

export type NotificationMessageSubscription = {
  notificationMessage:  {
    __typename: "Message",
    chatId: number | null,
    id: number | null,
    message: string | null,
    createdAt: string | null,
    username: string | null,
    profileImg: string | null,
    fullName: string | null,
    sent: boolean | null,
  } | null,
};

export type DeleteChatUserSubscriptionVariables = {
  username?: string | null,
};

export type DeleteChatUserSubscription = {
  deleteChatUser:  {
    __typename: "ChatUsers",
    username: string | null,
    roomId: number | null,
    id: number | null,
  } | null,
};

export type DetectChangeUserSubscriptionVariables = {
  roomId?: number | null,
};

export type DetectChangeUserSubscription = {
  detectChangeUser:  {
    __typename: "ChatUsers",
    username: string | null,
    roomId: number | null,
    id: number | null,
  } | null,
};

export type DetectRoomChangeSubscriptionVariables = {
  id?: number | null,
};

export type DetectRoomChangeSubscription = {
  detectRoomChange:  {
    __typename: "Room",
    id: string | null,
    name: string | null,
    createdAt: string | null,
    chatImg: string | null,
  } | null,
};

export type DetectFollowerSubscriptionVariables = {
  username?: string | null,
};

export type DetectFollowerSubscription = {
  detectFollower:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type DetectFollowsSubscriptionVariables = {
  follows?: string | null,
};

export type DetectFollowsSubscription = {
  detectFollows:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type DeleteFollowerSubscriptionVariables = {
  username?: string | null,
};

export type DeleteFollowerSubscription = {
  deleteFollower:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};

export type DeleteFollowsSubscriptionVariables = {
  follows?: string | null,
};

export type DeleteFollowsSubscription = {
  deleteFollows:  {
    __typename: "Follower",
    username: string | null,
    follows: string | null,
  } | null,
};
