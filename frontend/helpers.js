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

/**
 * Get current semester start date as a string
 *
 * @return {string}
 * Formatted date string "DD-MM-YYYY", e.g. "07-02-2022"
 */
export function getSemesterStartDateString() {
  //get current semester startdate
  const semesterStartDate = getMonday(new Date());
  const semesterDateString = `${twoDigit(
    semesterStartDate.getDate()
  )}-${twoDigit(semesterStartDate.getMonth())}-${twoDigit(
    semesterStartDate.getFullYear()
  )}`;

  return semesterDateString;
}

/**
 * Gets all classes for current semester
 *
 * @return {Promise<string[]>}
 * Array of classCodes
 */
export async function getAllClasses() {
  //get current semester startdate
  const semesterDateString = getSemesterStartDateString();

  const response = await fetch(`${constants.classesUrl}/${semesterDateString}`);
  const responseJson = await response.json();
  const modules = responseJson.SemesterModules;

  let classes = [];
  for (let module of modules) {
    for (let moduleClass of module.ModuleClasses) {
      classes.push(moduleClass.ClassCode);
    }
  }

  return classes;
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function twoDigit(n) {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}
