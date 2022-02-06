import * as constants from "../constants.js";
import { getLoginSession } from "../helpers.js";

//set form onsubmit
document.getElementById("form").onsubmit = updateOffer;
document.getElementById("deleteBtn").onclick = deleteOffer;

//get url params
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const id = urlParams.Id;
const want = urlParams.Want;
const offer = urlParams.Offer;

//get form dropdown options
const wantedClassOptions = ["DSA01", "ETI02", "ISM03"];
const offeringClassOptions = ["DSA04", "ETI05", "ISM06"];

//set form dropdown options
const wantedClassHtml = wantedClassOptions.map((value) => {
  const selected = value == want ? 'selected="selected"' : "";
  return `<option value="${value}" ${selected}>${value}</option>`;
});
document.getElementById("wantedClasses").innerHTML = wantedClassHtml;

const offeringClassHtml = offeringClassOptions.map((value) => {
  const selected = value == offer ? 'selected="selected"' : "";
  return `<option value="${value}" ${selected}>${value}</option>`;
});
document.getElementById("offeringClasses").innerHTML = offeringClassHtml;

async function updateOffer(e) {
  e.preventDefault();
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to update offers!");
    window.location.replace(constants.loginUrl);
    return;
  }

  const response = await fetch(`${constants.backendUrl}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      Want: document.getElementById("wantedClasses").value,
      Offer: document.getElementById("offeringClasses").value,
    }),
  });

  if (response.status != 200) {
    alert("Error updating offer: ", response.statusText);
    return;
  }

  alert("Offer has been updated!");
  window.location.replace(`${constants.frontendUrl}/html/viewOwn.html`);
}

async function deleteOffer() {
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to delete offers!");
    window.location.replace(constants.loginUrl);
    return;
  }

  const response = await fetch(`${constants.backendUrl}/${id}`, {
    method: "DELETE",
  });

  if (response.status != 200) {
    alert("Error deleting offer: ", response.statusText);
    return;
  }

  alert("Offer has been deleted!");
  window.location.replace(`${constants.frontendUrl}/html/viewOwn.html`);
}
