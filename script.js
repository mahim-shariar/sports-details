document.addEventListener("DOMContentLoaded", () => {
  fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=b")
    .then((res) => res.json())
    .then((data) => {
      displayCard(data.player.slice(0, 10));
    });
});

let handleSearch = (event) => {
  event.preventDefault();
  let search = document.getElementById("search").value;
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${search}`
  )
    .then((res) => res.json())
    .then((data) => {
      displayCard(data.player);
    });
};
let displayCard = (data) => {
  let cardContainer = document.getElementById("player-container");
  cardContainer.innerHTML = "";
  if (data == null) {
    let notfound = document.createElement("h1");
    notfound.className = "text-center";
    notfound.innerText = "Not Found";
    cardContainer.appendChild(notfound);
  } else {
    data.forEach((element) => {
      let card = document.createElement("div");
      card.className = "col-lg-4 mb-4";

      card.innerHTML = `
      <div class="card">
      <img class="card-img-top" src="${
        element.strThumb == null ? "./image/averter.jpg" : element.strThumb
      }" alt="${element.strPlayer}" />
      <div class="card-body">
        <h5 class="card-title">${element.strPlayer}</h5>
        <p class="card-text"><strong>Position:</strong> ${
          element.strPosition || "Unknown"
        }</p>
        <p class="card-text"><strong>Team:</strong> ${
          element.strTeam || "Unknown"
        }</p>
        <p class="card-text"><strong>Nationality:</strong> ${
          element.strNationality || "Unknown"
        }</p>
        <p class="card-text"><strong>Salary:</strong> ${
          element.strWage || "Unknown"
        }</p>

        <p class="card-text"><strong>Sport:</strong> ${
          element.strSport || "Unknown"
        }</p>

        <p class="card-text"><strong>Player Info:</strong> ${
          element.strDescriptionEN
            ? element.strDescriptionEN.slice(0, 80)
            : "Unknown"
        }</p>
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#playerDetailsModal" onclick="handleDetails(${
            element.idPlayer
          })" >Details</button>
          <button id="add-to-team-${
            element.idPlayer
          }" class="btn btn-success" onclick="addToTeam(${
        element.idPlayer
      })">Add to Team</button>
        </div>
        <div class="text-center mt-3" >
            <a href="${
              element.strFacebook
                ? element.strFacebook
                : "https://www.facebook.com/"
            }" class="me-2" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="${
              element.strTwitter ? element.strTwitter : "https://twitter.com/"
            }" class="me-2" target="_blank"><i class="fab fa-twitter"></i></a>
            <!-- Add more social media links if needed -->
          </div>
      </div>
    </div>`;

      cardContainer.appendChild(card);
      handlebtn(element.idPlayer);
    });
  }
};

let cart = [];

let addToTeam = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (cart.length < 11) {
        cart.push(data.players[0]);
        handlebtn(id);
        display();
      } else {
        let teamContainer = document.getElementById("team-container");
        let cant = document.createElement("div");
        cant.className = "text-center";
        cant.innerHTML = `
        <div class="alert alert-danger" role="alert">
        You Can't Add More Than 11 Players
        </div>
        `;
        teamContainer.appendChild(cant);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
let handlebtn = (id) => {
  let button = document.getElementById(`add-to-team-${id}`);
  if (button) {
    let isInCart = cart.some((player) => player.idPlayer == id);
    if (isInCart) {
      button.className = "btn btn-danger disabled";
      button.disabled = true;
      button.innerText = "Already Added!!";
    } else {
      button.className = "btn btn-success";
      button.disabled = false;
      button.innerText = "Add to Team";
    }
  }
};

let display = () => {
  let total_player = document.getElementById("total-player");
  total_player.innerText = cart.length;

  let teamContainer = document.getElementById("team-container");
  teamContainer.innerHTML = "";

  cart.forEach((element) => {
    let team = document.createElement("div");
    team.className =
      "d-flex justify-content-between align-items-center border-bottom my-2 p-1";
    team.innerHTML = `
    <img class="img-fluid rounded" width="100px" src="${
      element.strThumb == null ? "./image/averter.jpg" : element.strThumb
    }"/>
    <p class="text-bold" >${element.strPlayer}</p>
    `;
    teamContainer.appendChild(team);
  });
};

let handleDetails = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      let player = data.players[0];
      let modalBodyContent = document.getElementById("modal-body-content");
      modalBodyContent.innerHTML = `
        <img class="img-fluid rounded mb-3" src="${
          player.strThumb == null ? "./image/averter.jpg" : player.strThumb
        }" alt="${player.strPlayer}" />
        <h5>${player.strPlayer}</h5>
        <p><strong>Position:</strong> ${player.strPosition || "Unknown"}</p>
        <p><strong>Team:</strong> ${player.strTeam || "Unknown"}</p>
        <p><strong>Nationality:</strong> ${
          player.strNationality || "Unknown"
        }</p>
        <p><strong>Salary:</strong> ${player.strWage || "Unknown"}</p>
        <p><strong>Sport:</strong> ${player.strSport || "Unknown"}</p>
        <p><strong>Description:</strong> ${
          player.strDescriptionEN || "No description available"
        }</p>
      `;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
