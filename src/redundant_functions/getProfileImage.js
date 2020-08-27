import { Storage } from "aws-amplify";
export default async function getProfileImage(user_id) {
  return await Storage.vault
    .get(`profilePhoto.jpg`, {
      bucket: "user-images-hermes",
      level: "public",
      customPrefix: {
        public: `${user_id}/`,
      },
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    })
    .then((res) => {
      return res;
    });
}
