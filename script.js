const API_KEY = "Ia1QdBYIOBDrw8MQqZA73Aq0QLm1EedXVbw1gFAw";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

// Function to fetch the current image of the day
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await getImageOfTheDay(currentDate, false);
}

// Function to fetch an image for a specific date
async function getImageOfTheDay(date, saveToHistory = true) {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
    if (!response.ok) throw new Error("Failed to fetch image.");

    const data = await response.json();
    displayImage(data);

    if (saveToHistory) saveSearch(date);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Function to display the image in the UI
function displayImage(data) {
  const container = document.getElementById("image-content");
  container.innerHTML = `
    <img src="${data.url}" alt="${data.title}">
    <h3>${data.title}</h3>
    <p>${data.explanation}</p>
  `;
}

// Function to save a search date to local storage
function saveSearch(date) {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
    addSearchToHistory(date);
  }
}

// Function to add a search to the history UI
function addSearchToHistory(date) {
  const historyList = document.getElementById("search-history");
  const listItem = document.createElement("li");
  listItem.textContent = date;
  listItem.addEventListener("click", () => getImageOfTheDay(date, false));
  historyList.appendChild(listItem);
}

// Function to populate search history on page load
function populateSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach(addSearchToHistory);
}

// Event listener for the search form
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const date = document.getElementById("search-input").value;
  if (date) getImageOfTheDay(date);
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  populateSearchHistory();
});
