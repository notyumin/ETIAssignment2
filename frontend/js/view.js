async function displayAPIData() {
  //get API data
  /* const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  data = await response.json(); */
  const data = [
    {
      Id: 1,
      StudentId: "A90",
      Offer: "CS909",
      Want: "DSA02",
      IsCompleted: false,
    },
    {
      Id: 2,
      StudentId: "A90",
      Offer: "CS909",
      Want: "DSA02",
      IsCompleted: false,
    },
    {
      Id: 3,
      StudentId: "A90",
      Offer: "CS909",
      Want: "DSA02",
      IsCompleted: false,
    },
    {
      Id: 4,
      StudentId: "A90",
      Offer: "CS909",
      Want: "DSA02",
      IsCompleted: false,
    },
  ];

  //generate HTML code
  const tableData = data
    .map(function (value) {
      return `<tr>
            <td>${value.Id}</td>
            <td>${value.StudentId}</td>
            <td>${value.Offer}</td>
            <td>${value.Want}</td>
            <td><a href="">Accept Offer</a></td>
        </tr>`;
    })
    .join("");

  //set tableBody to new HTML code
  const tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = tableData;
}

displayAPIData();
