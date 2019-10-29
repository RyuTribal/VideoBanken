// tslint:disable
// this is an auto generated file. This will be overwritten

export const getVideoStorage = `query GetVideoStorage($videoKey: String!, $username: String!) {
  getVideoStorage(videoKey: $videoKey, username: $username) {
    username
    videoKey
    videoDesc
    videoTitle
    thumbKey
    category
    tags
    createdAt
    editedAt
  }
}
`;
export const listVideoStorages = `query ListVideoStorages(
  $filter: TableVideoStorageFilterInput
  $limit: Int
  $nextToken: String
) {
  listVideoStorages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      username
      videoKey
      videoDesc
      videoTitle
      thumbKey
      category
      tags
      createdAt
      editedAt
    }
    nextToken
  }
}
`;
