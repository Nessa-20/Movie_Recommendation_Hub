
// fetch(`https://api.themoviedb.org/3/movie/550?api_key=523ffaad73524a02d19e15a330343b1a`)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// TMDb API Configuration
const apiKey = '523ffaad73524a02d19e15a330343b1a';
const baseUrl = 'https://api.themoviedb.org/3';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');
const searchContainer = document.getElementById('search-container');
const watchlistContainer = document.getElementById('watchlist-container');
const noResults = document.getElementById('no-results');

// Fetch Default 18 Movies
async function fetchDefaultMovies() {
    try {
        const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&page=1`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 18), movieContainer);
    } catch (error) {
        console.error('Error fetching default movies:', error);
    }
}

// Fetch Movies by Search Query
async function fetchMovies(query) {
    try {
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        if (data.results.length > 0) {
            displayMovies(data.results, searchContainer);
            noResults.classList.add('hidden');
        } else {
            searchContainer.innerHTML = '';
            noResults.classList.remove('hidden');
        }
        document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

// Display Movies in a Grid with Ratings
function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        container.innerHTML += `
            <div class="movie-card">
                <img src="${imageUrl + movie.poster_path}" alt="${movie.title}" />
                <h3>${movie.title}</h3>
                <p>⭐ Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</p>
                <button onclick="saveToWatchlist(${movie.id})">Add to Watchlist</button>
            </div>
        `;
    });
}


// Save to Watchlist
function saveToWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Movie added to watchlist!');
        displayWatchlist();
        document.getElementById('watchlist').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('Movie is already in watchlist!');
    }
}

// Display Watchlist with Ratings
async function displayWatchlist() {
    watchlistContainer.innerHTML = '';
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    for (const movieId of watchlist) {
        try {
            const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
            const movie = await response.json();
            watchlistContainer.innerHTML += `
                <div class="watchlist-card">
                    <img src="${imageUrl + movie.poster_path}" alt="${movie.title}" />
                    <h3>${movie.title}</h3>
                    <p>⭐ Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10</p>
                    <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching watchlist movie details:', error);
        }
    }
}


// Remove from Watchlist
function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(id => id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

// Event Listener for Search
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
});


fetchDefaultMovies();
displayWatchlist();
