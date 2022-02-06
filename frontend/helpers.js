import * as constants from "./constants.js";
/**
 * Checks whether user has a login session
 *
 * @return {Promise<"error"|{userID: string, usertype: string}>}
 * userId and userType if success, "error" string if no session
 */
export async function getLoginSession() {
  //validate user logged in
  const response = await fetch(constants.sessionUrl, {
    credentials: "include",
  });
  if (response.status == 404) {
    return "error";
  }

  const data = await response.json();
  return data;
}
