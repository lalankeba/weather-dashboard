console.log("Welcome to Weather Dashboard");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

const search = () => {
    console.log("searching");
}

searchBtn.addEventListener('click', search);