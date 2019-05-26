async function getRandomUsers() {
  await fetch("https://randomuser.me/api/?results=12&nat=us")
    .then(response => response.json())
    .then(data => {
      searchBar(data.results);
      //   getUsers(data.results);
      return data;
    })
    .catch(err =>
      console.log(
        err,
        `error: "Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you."`
      )
    );
}
getRandomUsers();

const searchBar = data => {
  const searchContainer = document.querySelector(".search-container");
  searchContainer.innerHTML = `<form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>`;
  const searchSubmit = document.querySelector("#search-submit");
  const searchInput = document.querySelector("#search-input");
  getUsers(data);
  searchSubmit.addEventListener("click", e => {
    e.preventDefault();

    console.log(e.target);
    let filterData = data.filter(el =>
      el.name.first.includes(searchInput.value.toLowerCase())
    );

    if (document.querySelector(".errorMessage")) {
      document.querySelector(".errorMessage").remove();
    }
    console.log(filterData);
    getUsers(filterData);
    if (filterData.length === 0) {
      const errorMessage = document.createElement("h2");
      errorMessage.className = "errorMessage";
      errorMessage.innerHTML = `Sorry, no results found for "${
        searchInput.value
      }"`;
      document.body.append(errorMessage);
    }
  });
};

const getUsers = data => {
  const userList = data.map(user => {
    return `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src=${
              user.picture.large
            } alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${
      user.name.last
    }</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${
      user.location.state
    }</p>
        </div>
    </div>`;
  });
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = userList.join("");
  const cards = document.querySelectorAll(".card");
  cardsModalHandle(cards, data);
};

const cardsModalHandle = (cards, data) => {
  cards.forEach(card =>
    card.addEventListener("click", e => {
      const person = data.filter(
        user => user.email === card.children[1].children[1].innerHTML
      );

      console.log(person);
      modalDiv(person[0], data);
    })
  );
};

const closeModalHandler = (closeModalBtn, div) =>
  closeModalBtn.addEventListener("click", e => {
    div.remove();
  });

const prevModalHandler = (data, div, currentModalIndex) => {
  if (currentModalIndex > 0) {
    div.remove();
    modalDiv(data[currentModalIndex - 1], data);
  }
};

const nextModalHandler = (data, div, currentModalIndex) => {
  if (currentModalIndex < data.length - 1) {
    div.remove();
    modalDiv(data[currentModalIndex + 1], data);
  }
};

const modalDiv = (person, data) => {
  const div = document.createElement("div");
  let dob = new Date(person.dob.date);
  div.innerHTML = `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src=${
                person.picture.large
              } alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.name.first} ${
    person.name.last
  }</h3>
              <p class="modal-text" id='email'>${person.email}</p>
              <p class="modal-text cap">${person.location.city}</p>
              <hr>
              <p class="modal-text">${person.cell}</p>
              <p class="modal-text">${person.location.street}, ${
    person.location.city
  }, ${person.location.state} ${person.location.postcode}</p>
              <p class="modal-text">Birthday: ${dob.getMonth() +
                1}/${dob.getDate()}/${dob.getFullYear()}</p>
          </div>
          <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
      </div>`;
  document.body.append(div);
  const email = document.querySelector("#email");
  console.log(email);
  let currentModalIndex = data.findIndex(el => el.email === email.innerHTML);
  console.log(currentModalIndex);
  const modalContainer = document.querySelector(".modal-container");

  const closeModalBtn = document.querySelector(".modal-close-btn");

  closeModalHandler(closeModalBtn, modalContainer);

  const prevModalBtn = document.querySelector("#modal-prev");
  prevModalBtn.addEventListener("click", e => {
    console.log(e.target);
    prevModalHandler(data, modalContainer, currentModalIndex);
  });
  const nextModalBtn = document.querySelector("#modal-next");
  nextModalBtn.addEventListener("click", e => {
    console.log(e.target);
    nextModalHandler(data, modalContainer, currentModalIndex);
  });
};
