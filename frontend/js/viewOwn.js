import * as constants from "../constants.js";
import { getLoginSession } from "../helpers.js";

let classOffers;

//set oninput for filter
document.getElementById("want").oninput = filter;
document.getElementById("offer").oninput = filter;

//load api data into table
displayAPIData();

async function displayAPIData() {
  const userSession = await getLoginSession();
  if (userSession == "error") {
    alert("You must be logged in to view your offers!");
    window.location.replace(constants.loginUrl);
    return;
  }

  const studentId = userSession.userID;
  //const studentId = "someStudentId";

  //get API data
  const response = await fetch(constants.backendUrl);
  classOffers = await response.json();
  classOffers = classOffers.filter((c) => {
    return c.CreatedBy == studentId;
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
      const urlQueryParam = `?Id=${value.Id}&Want=${value.Want}&Offer=${value.Offer}`;

      return `<tr>
            <td>${value.Id}</td>
            <td>${value.CreatedBy}</td>
            <td>${value.Want}</td>
            <td>${value.Offer}</td>
            <td>${value.CompletedBy}</td>
            ${
              value.CompletedBy == ""
                ? "<td>\
              <a class = 'btn btn-outline-primary' href='./edit.html" +
                  urlQueryParam +
                  "'>\
                Edit Offer\
              </a>\
            </td>"
                : ""
            }
        </tr>`;
    })
    .join("");

  //set tableBody to new HTML code
  const tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = dataHtml;
}
