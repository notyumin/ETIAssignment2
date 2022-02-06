import * as constants from "../constants.js";
import { getLoginSession, getSemesterStartDateString } from "../helpers.js";

let classOffers;

//set global acceptOffer function
window.acceptOffer = acceptOffer;

//set oninput for filter
document.getElementById("want").oninput = filter;
document.getElementById("offer").oninput = filter;

//load api data into table
displayAPIData();

async function displayAPIData() {
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to view offers!");
    window.location.replace(constants.loginUrl);
    return;
  }

  const studentId = userSession.userID;
  //const studentId = "anotherStudentId";

  //get API data
  const response = await fetch(constants.backendUrl);
  classOffers = await response.json();
  classOffers = classOffers.filter((c) => {
    return c.CompletedBy == "" && c.CreatedBy != studentId;
  });

  renderTable(classOffers);
}

//Filter Function for Search
async function filter() {
  const wantedSearch = document
    .getElementById("want")
    .value.trim()
    .toUpperCase();
  const offeringSearch = document
    .getElementById("offer")
    .value.trim()
    .toUpperCase();

  const filteredOffers = classOffers.filter((c) => {
    if (wantedSearch == "" && offeringSearch == "") {
      return true;
    } else if (wantedSearch == "") {
      return c.Offer.toUpperCase().includes(offeringSearch);
    } else if (offeringSearch == "") {
      return c.Want.toUpperCase().includes(wantedSearch);
    } else {
      return (
        c.Offer.toUpperCase().includes(offeringSearch) &&
        c.Want.toUpperCase().includes(wantedSearch)
      );
    }
  });

  renderTable(filteredOffers);
}

function renderTable(data) {
  const dataHtml = data
    .map(function (value) {
      return `<tr>
            <td>${value.Id}</td>
            <td>${value.CreatedBy}</td>
            <td>${value.Want}</td>
            <td>${value.Offer}</td>
            <td>
              <a onclick="window.acceptOffer(${value.Id})" class="btn btn-outline-primary">
                Accept Offer
              </a>
            </td>
        </tr>`;
    })
    .join("");

  //set tableBody to new HTML code
  const tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = dataHtml;
}

async function acceptOffer(offerId) {
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to accept offers!");
    window.location.replace(constants.loginUrl);
    return;
  }

  const completedBy = userSession.userID;
  //const completedBy = "anotherStudentId";

  const response = await fetch(`${constants.backendUrl}/${offerId}`, {
    method: "PUT",
    body: JSON.stringify({
      CompletedBy: completedBy,
    }),
  });

  if (response.status != 200) {
    alert("Error accepting offer: ", response.statusText);
    return;
  }

  //update student's classes
  const newOffer = await response.json();
  await swapStudentClass(
    newOffer.Offer,
    newOffer.CreatedBy,
    newOffer.CompletedBy
  );
  await swapStudentClass(
    newOffer.Want,
    newOffer.CompletedBy,
    newOffer.CreatedBy
  );

  alert("Offer has been accepted!");
  //reload table
  displayAPIData();
}

async function swapStudentClass(classCode, sToRemove, sToAdd) {
  //get current semester startdate
  const semesterDateString = getSemesterStartDateString();

  //get class info localhost:8041/api/v1/classes/{semester_start_date}?classCode=...
  let response = await fetch(
    `${constants.classesUrl}/${semesterDateString}?classCode=${classCode}`
  );
  const currentClassInfo = await response.json();

  //update class info
  const removedStudentList = currentClassInfo.Students.filter((student) => {
    return student != sToRemove;
  });
  const newStudentList = [...removedStudentList, sToAdd];

  //get modulecode from classcode
  const moduleCode = classCode.split("_")[0];

  //send update request
  await fetch(
    `${constants.classesUrl}/${semesterDateString}?moduleCode=${moduleCode}&classCode=${classCode}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Students: newStudentList,
      }),
    }
  );
}
