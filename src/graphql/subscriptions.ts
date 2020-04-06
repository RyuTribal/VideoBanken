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
    comments
    createdAt
    editedAt
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
    comments
    createdAt
    editedAt
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
    comments
    createdAt
    editedAt
  }
}
`;
