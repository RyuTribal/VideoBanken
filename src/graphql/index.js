import client from "../client";
export default async function hermesAPI(method, type, queryString, variables) {
  const payload = client[method]({
    [type]: queryString,
    variables: variables,
  }).then((res) => {
    return res;
  });
  return payload;
}
