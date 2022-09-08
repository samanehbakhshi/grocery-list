// Selection elements from DOM
const $ = document;
const input = $.querySelector(".input");
const addBtn = $.querySelector(".add-btn");
const clearBtn = $.querySelector(".clear-btn");
const ul = $.querySelector(".list");
const addModal = $.querySelector(".modal-add");
const deleteModal = $.querySelector(".modal-delete");

// To save input value
let itemName;
// List of items
let listItems = [];

// Start create list items
function createListItem() {
  itemName = input.value;
  listItems.push(itemName);
  addListItemToLocalstorage(listItems);
  addItemToDOM(listItems);
  input.focus();
}

// Add list items to local Storage
function addListItemToLocalstorage(listItems) {
  localStorage.setItem("itemsList", JSON.stringify(listItems));
}

// Add list items to DOM
function addItemToDOM(items) {
  ul.innerHTML = "";
  items.forEach((item, index) => {
    const li = $.createElement("li");
    li.innerHTML = item;

    // START ADD DELETE BUTTON
    const trashBtn = $.createElement("button");
    trashBtn.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="{1.5}"
    stroke="currentColor"
    <!--
    class="trash-icon"
    --
  >
    >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg`;
    // add trash button to li
    li.appendChild(trashBtn);
    // END ADD DELETE BUTTON

    // set function to delete single li element
    trashBtn.setAttribute("onclick", `deleteItem(${index})`);

    // add li element to ul
    ul.append(li);
  });
}

// delete single item from list item
function deleteItem(index) {
  const todos = JSON.parse(localStorage.getItem("itemsList"));

  // Set main list with list items from local storage
  listItems = todos;

  // Find the main elment name to delete
  const element = listItems[index];

  // Delete main item of list items
  listItems.splice(index, 1);

  // Show deleted item name in modal
  showAction(deleteModal, `${element} removed from the list`, true);

  // Set local storage with new list items
  addListItemToLocalstorage(listItems);

  // Add new list items to DOM
  addItemToDOM(listItems);
}

// delete all list items
function clearListItems() {
  if (listItems.length > 0) {
    showAction(deleteModal, "All items deleted", false);
    listItems = [];
    localStorage.removeItem("itemsList");
    addItemToDOM(listItems);
  } else {
    showAction(deleteModal, "No more item to delete", false);
  }
}

// show modal
function showAction(element, text, value) {
  element.style.display = "block";
  if (value) {
    element.classList.add("success");
    element.innerHTML = text;
    setTimeout(() => {
      element.style.display = "none";
    }, 3000);
  } else {
    element.classList.add("error");
    element.innerHTML = text;
    setTimeout(() => {
      element.style.display = "none";
    }, 3000);
  }
  input.value = "";
}

function addListItemAfterKeypress(event) {
  // if the input value not empty and enter key pressed create li element
  if (event.key === "Enter" && input.value.trim()) {
    console.log("success");
    createListItem();
    showAction(addModal, `${itemName} added to the list`, true);

    // if the input value are empty and enter key pressed show below message
  } else if (!input.value.trim() && event.key === "Enter") {
    showAction(addModal, "Please add grocery item", true);
  }
}

function addListItemAfterClick() {
  // if input value isn't empty create li element
  if (input.value.trim()) {
    createListItem();
    showAction(addModal, `${itemName} added to the list`, true);
  } else {
    showAction(addModal, "Please add grocery item", false);
  }
}

// get list items from local storage after load page
function getListItemsFromLocalstorage() {
  const items = JSON.parse(localStorage.getItem("itemsList"));
  items ? (listItems = items) : (listItems = []);
  addItemToDOM(listItems);
}

// Add event listeners
// Input listener to add item by press enter
input.addEventListener("keypress", addListItemAfterKeypress);
// Submit listener
addBtn.addEventListener("click", addListItemAfterClick);
// Clear list
clearBtn.addEventListener("click", clearListItems);
// Check for local storage
window.addEventListener("load", getListItemsFromLocalstorage);
