/************************************************
    Fetch API 
*************************************************/
//use the fetch api to get 12 random users that are from nationality US
//use catch to display any error to the console
async function getRandomUsers() {
  await fetch("https://randomuser.me/api/?results=12&nat=us")
    .then(response => response.json())
    .then(data => {
      //pass the results from the data to the searchBar function
      searchBar(data.results);
    })
    .catch(err =>
      console.log(
        err,
        `error: "Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you."`
      )
    );
}
//initialize the fetch getRandomUsers function
getRandomUsers();

/************************************************
    Search Bar 
*************************************************/
const searchBar = data => {
  //Create the HTML for the searchBar
  const searchContainer = document.querySelector(".search-container");
  searchContainer.innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
  const searchSubmit = document.querySelector("#search-submit");
  const searchInput = document.querySelector("#search-input");
  //if no search input then display the entire data into getUsers
  getUsers(data);
  searchSubmit.addEventListener("click", e => {
    //if there is input search value then filter the results with the data
    let filterData = data.filter(el =>
      el.name.first.includes(searchInput.value.toLowerCase())
    );
    //pass the filterData into getUsers to display the new data
    getUsers(filterData);

    //if there is a error message being display on screen remove it
    if (document.querySelector(".errorMessage")) {
      document.querySelector(".errorMessage").remove();
    }
    //if search value is not found display search error
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
/************************************************
    Get User Data
*************************************************/
const getUsers = data => {
  //map through the provided data passed from the seachBar to create the user cards
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
  //append the userList to the gallery div
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = userList.join("");
  const cards = document.querySelectorAll(".card");
  //pass the cards and data from the searchBar for the click event
  cardsModalHandle(cards, data);
};
/************************************************
    Build User Cards
*************************************************/
const cardsModalHandle = (cards, data) => {
  //each card get a click event to display the modal
  cards.forEach(card =>
    card.addEventListener("click", e => {
      const person = data.filter(
        user => user.email === card.children[1].children[1].innerHTML
      );
      //filter to find the clicked card div that matches the same email with the data passed from the search bar
      //pass the data to create the modal div that was clicked
      modalDiv(person[0], data);
    })
  );
};

/************************************************
    Event Handlers For Modal
*************************************************/
const closeModalHandler = (closeModalBtn, div) =>
  //when the X is clicked inside the modal remove the div from being displayed
  closeModalBtn.addEventListener("click", () => {
    div.remove();
  });

const prevModalHandler = (data, div, currentModalIndex) => {
  //click event function being triggered from inside the modalDiv
  if (currentModalIndex > 0) {
    div.remove();
    //get the current modalIndex and pass the previous modalIndex to be display
    modalDiv(data[currentModalIndex - 1], data);
  }
};

const nextModalHandler = (data, div, currentModalIndex) => {
  //click event function being triggered from inside the modalDiv
  if (currentModalIndex < data.length - 1) {
    div.remove();
    //get the current modalIndex and pass the next modalIndex to be display
    modalDiv(data[currentModalIndex + 1], data);
  }
};

/************************************************
    Create Modal Div
*************************************************/
const modalDiv = (person, data) => {
  //Create the div with the HTML for the modal and display the current person data into the modal information
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
  //pass the modal information to activate the click event when the modal closed button is clicked
  const modalContainer = document.querySelector(".modal-container");
  const closeModalBtn = document.querySelector(".modal-close-btn");
  closeModalHandler(closeModalBtn, modalContainer);

  //get the email to filter the current modal index
  const email = document.querySelector("#email");
  let currentModalIndex = data.findIndex(el => el.email === email.innerHTML);
  const prevModalBtn = document.querySelector("#modal-prev");
  //pass the searchBar data, the modal container, and the current modal index withing the filtered data to both the prevModalBtn and nextModalBtn to activate next and previous modal for the users
  prevModalBtn.addEventListener("click", () => {
    prevModalHandler(data, modalContainer, currentModalIndex);
  });
  const nextModalBtn = document.querySelector("#modal-next");
  nextModalBtn.addEventListener("click", () => {
    nextModalHandler(data, modalContainer, currentModalIndex);
  });
};
