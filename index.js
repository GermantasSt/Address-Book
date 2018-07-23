const addGuest = document.querySelector('#addGuest');
const guestName = document.querySelector('#name');
const guestPhone = document.querySelector('#phone');
const favouriteAdd = document.querySelector('#favourite');
const guestBook = document.querySelector('#guestBook');
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');

// We create empty array that will be used later and its data will be manipulated;
let guestArray = [];
// Guest array data is drawn in the html element;
guestBook.innerHTML = guestArray;

searchButton.addEventListener('click', () => {
  const searchResults = guestArray.filter(contact => (
    contact.name === searchInput.value || !searchInput.value
  ));
  draw(searchResults);
});

function draw(searchResults) {
  // It receives searchResults value from other button
  const contacts = searchResults || guestArray;
  guestBook.innerHTML = '';
  contacts.forEach((element, index) => {
    // We create new elements that dont exist in html file yet, they are in mind but they dont appear on the page yet;
    const addressSection = document.createElement('div');
    const entryName = document.createElement(element.editing ? 'input' : 'span');
    const entryPhone = document.createElement(element.editing ? 'input' : 'span');
    const entryFavourite = document.createElement(element.editing ? 'input' : 'span');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');
    const saveButton = document.createElement('button');
    // This statement gives different kind of values ,depending on editing value, to elements because input values cannot use inner html values;
    if (element.editing) {
      entryFavourite.type = 'checkbox';
      entryName.value = element.name;
      entryPhone.value = element.phone;
      entryFavourite.checked = element.isFavourite;
    } else {
      entryName.innerHTML = element.name;
      entryPhone.innerHTML = element.phone;
      entryFavourite.innerHTML = element.isFavourite;
    }

    editButton.innerHTML = 'EDIT ENTRY';

    editButton.addEventListener('click', () => {
      // When we press editing button we change object with exact index editing value, it activates if statements where we create new elements and append them in this function;
      const id = contacts.findIndex(value => value.id === element.id);
      guestArray[id].editing = true;
      draw();
    });
    deleteButton.innerHTML = 'DELETE ENTRY';
    deleteButton.addEventListener('click', () => {
      // When delete button is pressed it deletes object from the array by its index, then loads new array to local storage and redraws new array on the page;
      guestArray.splice(index, 1);
      persistData();
      draw();
    });

    saveButton.innerHTML = 'SAVE ENTRY';
    saveButton.addEventListener('click', () => {
      // When we press save button input values are saved in the array exact index object and then redraw the array on the page;
      guestArray[index].name = entryName.value;
      guestArray[index].phone = entryPhone.value;
      guestArray[index].isFavourite = entryFavourite.checked;
      guestArray[index].editing = false;
      draw();
    });
    // We append all the new elements to our div element that is in the other div element that has been drawn in the html file in the beginning;
    addressSection.appendChild(entryName);
    addressSection.appendChild(entryPhone);
    addressSection.appendChild(entryFavourite);
    addressSection.appendChild(deleteButton);
    // If element editing value is true it appends save button, if false it appends edit button;
    addressSection.appendChild(element.editing ? saveButton : editButton);
    guestBook.appendChild(addressSection);
  });
}

window.addEventListener('load', () => {
  // We load our values to array from local storage and then redraw it on the page;
  // If array is empty we use or method;
  guestArray = JSON.parse(localStorage.getItem('contact')) || [];
  draw();
});

function addContact(newContact) {
  // It receives object values from input when add button is pressed and pushes its values into our empty array;
  guestArray.push(newContact);
}

function persistData() {
  // Save array values to local storage
  localStorage.setItem('contact', JSON.stringify(guestArray));
}

addGuest.addEventListener('click', () => {
  const newContact = {
    // We create object keys and selecting input values;
    // We create editing value in object to later be able to manipulate our array by editing and saving new values;
    name: guestName.value, phone: guestPhone.value, isFavourite: favouriteAdd.checked, editing: false, id: guestArray.length,
  };
  // This function pushes new object into the array, it is wrote above;
  addContact(newContact);
  draw();
  // This function saves our present array to local storage;
  persistData();
});
