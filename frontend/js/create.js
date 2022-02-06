import { getLoginSession } from "../helpers.js";
import * as constants from "../constants.js";

//set form onsubmit
document.getElementById("form").onsubmit = submit;

//get form dropdown options
const wantedClassOptions = ["DSA01", "ETI02", "ISM03"];
const offeringClassOptions = ["DSA04", "ETI05", "ISM06"];

//set form dropdown options
const wantedClassHtml = wantedClassOptions.map((value) => {
  return `<option value="${value}">${value}</option>`;
});
document.getElementById("wantedClasses").innerHTML = wantedClassHtml;

const offeringClassHtml = offeringClassOptions.map((value) => {
  return `<option value="${value}">${value}</option>`;
});
document.getElementById("offeringClasses").innerHTML = offeringClassHtml;

//form onsubmit
async function submit(e) {
  e.preventDefault();

  const wantedClass = document.getElementById("wantedClasses").value;
  const offeringClass = document.getElementById("offeringClasses").value;

  //validate user logged in
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to create offers!");
    return;
  }

  const createdBy = userSession.userID;
  //const createdBy = "someStudentId";

  //call api
  const response = await fetch(constants.backendUrl, {
    method: "POST",
    body: JSON.stringify({
      createdBy,
      want: wantedClass,
      offer: offeringClass,
    }),
  });

  if (response.status != 200) {
    alert("Error creating offer: ", response.statusText);
    return;
  }

  //alert and redirect
  alert("Class Offer Created");
  window.location.replace("http://localhost:8140");
}
