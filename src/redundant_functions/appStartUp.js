import getProfileImage from ".//getProfileImage";
import hermesAPI from "../graphql/index";
import { Auth } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
async function generateUser(user) {
  let emailHandle = user.attributes.email.split("@")[0];
  let emailFirstName = emailHandle.split(".")[0];
  let emailSurName = emailHandle.split(".")[1];
  let generatedUserName = "";
  let generatedFullName = "";
  if (emailSurName === "" || !emailSurName) {
    generatedUserName =
      emailFirstName.charAt(0).toUpperCase() + emailFirstName.slice(1);
    generatedFullName = generatedUserName;
  } else {
    generatedUserName =
      emailFirstName.charAt(0).toUpperCase() +
      emailSurName.charAt(0).toUpperCase() +
      emailSurName.slice(1);
    generatedFullName = `${
      emailFirstName.charAt(0).toUpperCase() + emailFirstName.slice(1)
    } ${emailSurName.charAt(0).toUpperCase() + emailSurName.slice(1)}`.replace(
      /[0-9]/g,
      ""
    );
  }
  const userInfo = await hermesAPI(
    "query",
    "query",
    queries.getUserByUsername,
    {
      username: generatedUserName,
    }
  )
    .then((res) => {
      if (!res.data.getUserByUsername) {
        return {
          username: generatedUserName,
          fullName: generatedFullName,
          email: user.attributes.email,
          id: user.username,
        };
      } else {
        return {
          fullName: generatedFullName,
          email: user.attributes.email,
          id: user.username,
        };
      }
    })
    .catch((err) => {
      return {
        username: generatedUserName,
        fullName: generatedFullName,
        email: user.attributes.email,
        id: user.username,
      };
    });
  if (!userInfo.username) {
    console.log(user);
    userInfo.username = user.username;
  }
  return userInfo;
}
export default async function appStartUp(props) {
  const account = await Auth.currentAuthenticatedUser();
  const user = await hermesAPI("query", "query", queries.getUser, {
    id: account.username,
  })
    .then((res) => {
      return res.data.getUser;
    })
    .catch((err) => {
      return false;
    });
  if (user) {
    props.set_user(user);
    const profileImg = await getProfileImage(user.id);
    props.set_profile_img(profileImg);
    return true;
  } else {
    const generatedUser = await generateUser(account);
    const newUser = await hermesAPI("mutate", "mutation", mutations.addUser, {
      id: generatedUser.id,
      username: generatedUser.username,
      fullName: generatedUser.fullName,
      email: generatedUser.email,
    }).then((res) => {
      return res.data.addUser;
    });
    props.set_user(newUser);
    return false;
  }
}
