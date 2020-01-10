/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateVideoStorageInput = {
  videoKey: string,
  username: string,
  videoDesc: string,
  videoTitle: string,
  thumbKey: string,
  tags: string,
  likes?: string | null,
  dislikes?: string | null,
  views?: string | null,
  category: string,
  createdAt: string,
  editedAt?: string | null,
  ammountComments?: string | null,
};

export type UpdateVideoStorageInput = {
  username?: string | null,
  videoKey?: string | null,
  videoDesc?: string | null,
  videoTitle?: string | null,
  thumbKey?: string | null,
  category?: string | null,
  tags?: string | null,
  likes?: string | null,
  dislikes?: string | null,
  views?: string | null,
  createdAt?: string | null,
  editedAt?: string | null,
  ammountComments?: string | null,
};

export type DeleteVideoStorageInput = {
  videoKey: string,
};

export type CreateUserStorageInput = {
  username: string,
  likedVideos: string,
  dislikedVideos: string,
};

export type UpdateUserStorageInput = {
  username: string,
  likedVideos?: string | null,
  dislikedVideos?: string | null,
};

export type DeleteUserStorageInput = {
  username: string,
};

export type CreateCommentStorageInput = {
  videoKey: string,
  username: string,
  comment: string,
  createdAt: string,
  ammountReplies: string,
  likes: string,
  dislikes: string,
  isEdited: boolean,
};

export type UpdateCommentStorageInput = {
  commentKey: string,
  videoKey: string,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
  ammountReplies?: string | null,
  likes?: string | null,
  dislikes?: string | null,
  isEdited?: boolean | null,
};

export type DeleteCommentStorageInput = {
  commentKey: string,
  videoKey: string,
};

export type CreateReplyStorageInput = {
  commentKey: string,
  username: string,
  comment: string,
  createdAt: string,
  likes: string,
  dislikes: string,
};

export type UpdateReplyStorageInput = {
  commentKey: string,
  replyKey: string,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
  likes?: string | null,
  dislikes?: string | null,
};

export type DeleteReplyStorageInput = {
  commentKey: string,
  replyKey: string,
};

export type TableVideoStorageFilterInput = {
  username?: TableStringFilterInput | null,
  videoKey?: TableStringFilterInput | null,
  videoDesc?: TableStringFilterInput | null,
  videoTitle?: TableStringFilterInput | null,
  thumbKey?: TableStringFilterInput | null,
  category?: TableStringFilterInput | null,
  createdAt?: TableStringFilterInput | null,
  editedAt?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableUserStorageFilterInput = {
  username?: TableStringFilterInput | null,
};

export type TableCommentStorageFilterInput = {
  commentKey?: TableStringFilterInput | null,
  videoKey?: TableStringFilterInput | null,
  username?: TableStringFilterInput | null,
  comment?: TableStringFilterInput | null,
  createdAt?: TableStringFilterInput | null,
};

export type TableReplyStorageFilterInput = {
  commentKey?: TableStringFilterInput | null,
  replyKey?: TableStringFilterInput | null,
  username?: TableStringFilterInput | null,
  comment?: TableStringFilterInput | null,
  createdAt?: TableStringFilterInput | null,
};

export type CreateVideoStorageMutationVariables = {
  input: CreateVideoStorageInput,
};

export type CreateVideoStorageMutation = {
  createVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type UpdateVideoStorageMutationVariables = {
  input: UpdateVideoStorageInput,
};

export type UpdateVideoStorageMutation = {
  updateVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type DeleteVideoStorageMutationVariables = {
  input: DeleteVideoStorageInput,
};

export type DeleteVideoStorageMutation = {
  deleteVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type CreateUserStorageMutationVariables = {
  input: CreateUserStorageInput,
};

export type CreateUserStorageMutation = {
  createUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type UpdateUserStorageMutationVariables = {
  input: UpdateUserStorageInput,
};

export type UpdateUserStorageMutation = {
  updateUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type DeleteUserStorageMutationVariables = {
  input: DeleteUserStorageInput,
};

export type DeleteUserStorageMutation = {
  deleteUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type CreateCommentStorageMutationVariables = {
  input: CreateCommentStorageInput,
};

export type CreateCommentStorageMutation = {
  createCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type UpdateCommentStorageMutationVariables = {
  input: UpdateCommentStorageInput,
};

export type UpdateCommentStorageMutation = {
  updateCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type DeleteCommentStorageMutationVariables = {
  input: DeleteCommentStorageInput,
};

export type DeleteCommentStorageMutation = {
  deleteCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type CreateReplyStorageMutationVariables = {
  input: CreateReplyStorageInput,
};

export type CreateReplyStorageMutation = {
  createReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type UpdateReplyStorageMutationVariables = {
  input: UpdateReplyStorageInput,
};

export type UpdateReplyStorageMutation = {
  updateReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type DeleteReplyStorageMutationVariables = {
  input: DeleteReplyStorageInput,
};

export type DeleteReplyStorageMutation = {
  deleteReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type GetVideoStorageQueryVariables = {
  videoKey: string,
};

export type GetVideoStorageQuery = {
  getVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type ListVideoStoragesQueryVariables = {
  filter?: TableVideoStorageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListVideoStoragesQuery = {
  listVideoStorages:  {
    __typename: "VideoStorageConnection",
    items:  Array< {
      __typename: "VideoStorage",
      username: string,
      videoKey: string,
      videoDesc: string,
      videoTitle: string,
      thumbKey: string,
      category: string,
      tags: string,
      likes: string | null,
      dislikes: string | null,
      views: string | null,
      createdAt: string,
      editedAt: string | null,
      ammountComments: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetUserStorageQueryVariables = {
  username: string,
};

export type GetUserStorageQuery = {
  getUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type ListUserStoragesQueryVariables = {
  filter?: TableUserStorageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserStoragesQuery = {
  listUserStorages:  {
    __typename: "UserStorageConnection",
    items:  Array< {
      __typename: "UserStorage",
      username: string,
      likedVideos: string | null,
      dislikedVideos: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCommentStorageQueryVariables = {
  commentKey: string,
  videoKey: string,
};

export type GetCommentStorageQuery = {
  getCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type ListCommentStoragesQueryVariables = {
  videoKey: string,
  filter?: TableCommentStorageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCommentStoragesQuery = {
  listCommentStorages:  {
    __typename: "CommentStorageConnection",
    items:  Array< {
      __typename: "CommentStorage",
      commentKey: string | null,
      videoKey: string,
      username: string,
      comment: string,
      createdAt: string,
      ammountReplies: string,
      likes: string,
      dislikes: string,
      isEdited: boolean | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetReplyStorageQueryVariables = {
  replyKey: string,
  commentKey: string,
};

export type GetReplyStorageQuery = {
  getReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type ListReplyStoragesQueryVariables = {
  commentKey: string,
  filter?: TableReplyStorageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReplyStoragesQuery = {
  listReplyStorages:  {
    __typename: "ReplyStorageConnection",
    items:  Array< {
      __typename: "ReplyStorage",
      commentKey: string,
      replyKey: string,
      username: string,
      comment: string,
      createdAt: string,
      likes: string,
      dislikes: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateVideoStorageSubscriptionVariables = {
  username?: string | null,
  videoKey?: string | null,
  videoTitle?: string | null,
  category?: string | null,
  thumbKey?: string | null,
};

export type OnCreateVideoStorageSubscription = {
  onCreateVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type OnUpdateVideoStorageSubscriptionVariables = {
  username?: string | null,
  videoKey?: string | null,
  videoTitle?: string | null,
  category?: string | null,
  thumbKey?: string | null,
};

export type OnUpdateVideoStorageSubscription = {
  onUpdateVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type OnDeleteVideoStorageSubscriptionVariables = {
  username?: string | null,
  videoKey?: string | null,
  videoTitle?: string | null,
  category?: string | null,
  thumbKey?: string | null,
};

export type OnDeleteVideoStorageSubscription = {
  onDeleteVideoStorage:  {
    __typename: "VideoStorage",
    username: string,
    videoKey: string,
    videoDesc: string,
    videoTitle: string,
    thumbKey: string,
    category: string,
    tags: string,
    likes: string | null,
    dislikes: string | null,
    views: string | null,
    createdAt: string,
    editedAt: string | null,
    ammountComments: string | null,
  } | null,
};

export type OnCreateUserStorageSubscriptionVariables = {
  username?: string | null,
};

export type OnCreateUserStorageSubscription = {
  onCreateUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type OnUpdateUserStorageSubscriptionVariables = {
  username?: string | null,
};

export type OnUpdateUserStorageSubscription = {
  onUpdateUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type OnDeleteUserStorageSubscriptionVariables = {
  username?: string | null,
};

export type OnDeleteUserStorageSubscription = {
  onDeleteUserStorage:  {
    __typename: "UserStorage",
    username: string,
    likedVideos: string | null,
    dislikedVideos: string | null,
  } | null,
};

export type OnCreateCommentStorageSubscriptionVariables = {
  commentKey?: string | null,
  videoKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnCreateCommentStorageSubscription = {
  onCreateCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type OnUpdateCommentStorageSubscriptionVariables = {
  commentKey?: string | null,
  videoKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnUpdateCommentStorageSubscription = {
  onUpdateCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type OnDeleteCommentStorageSubscriptionVariables = {
  commentKey?: string | null,
  videoKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnDeleteCommentStorageSubscription = {
  onDeleteCommentStorage:  {
    __typename: "CommentStorage",
    commentKey: string | null,
    videoKey: string,
    username: string,
    comment: string,
    createdAt: string,
    ammountReplies: string,
    likes: string,
    dislikes: string,
    isEdited: boolean | null,
  } | null,
};

export type OnCreateReplyStorageSubscriptionVariables = {
  commentKey?: string | null,
  replyKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnCreateReplyStorageSubscription = {
  onCreateReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type OnUpdateReplyStorageSubscriptionVariables = {
  commentKey?: string | null,
  replyKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnUpdateReplyStorageSubscription = {
  onUpdateReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};

export type OnDeleteReplyStorageSubscriptionVariables = {
  commentKey?: string | null,
  replyKey?: string | null,
  username?: string | null,
  comment?: string | null,
  createdAt?: string | null,
};

export type OnDeleteReplyStorageSubscription = {
  onDeleteReplyStorage:  {
    __typename: "ReplyStorage",
    commentKey: string,
    replyKey: string,
    username: string,
    comment: string,
    createdAt: string,
    likes: string,
    dislikes: string,
  } | null,
};
