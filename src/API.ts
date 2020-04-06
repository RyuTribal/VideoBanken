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
  comments?: string | null,
  category: string,
  createdAt: string,
  editedAt?: string | null,
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
  comments?: string | null,
  createdAt?: string | null,
  editedAt?: string | null,
};

export type DeleteVideoStorageInput = {
  videoKey: string,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
      comments: string | null,
      createdAt: string,
      editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
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
    comments: string | null,
    createdAt: string,
    editedAt: string | null,
  } | null,
};
