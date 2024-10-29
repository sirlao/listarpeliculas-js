const apiKey = ''; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');

let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];



// Fetch and display popular movies
async function fetchPopularMovies() {

    try {

        try {
            //Llamando a la API
            const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error fetching popular movies:', error);
        }

    } catch (error) {

        console.error('Error fetching popular movies:', error);

    }

}



// Display movies

function displayMovies(movies) {
    //Limpiando la lista
    movieList.innerHTML = ''; 
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}



// Show movie details

async function showMovieDetails(movieId) {
    try {
        //Solicigtud de detalles
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();

        //Actualizando contenedor
        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p>${data.overview}</p>`;
        movieDetails.classList.remove('hidden');
        selectedMovieId = movieId;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}



// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            //Solicitud de busqueda y mostrar resultados
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});



// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            //Almacenamiento local
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            //Lista actualizada de favoritos
            displayFavorites(); 
        }
    }
});



// Display favorite movies
function displayFavorites() {
    //Limpiando lista favoritos
    favoritesList.innerHTML = '';
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}



// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas