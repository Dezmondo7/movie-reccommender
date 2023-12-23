// Wait for the document to be fully loaded before executing JavaScript
$(document).ready(function (e) {
    // When the searchButton is clicked...
    $('#searchButton').on('click', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior
        // Get values from input fields
        const movieName = $('#movieNameInput').val();
        const movieYear = $('#movieYearInput').val();

        // Call the searchMovie function with the movie name and year
        searchMovie(movieName, movieYear);
    });

    // Event delegation for dynamically added images within #searchResults
    $('#searchResults').on('click', 'img.movie-poster', function () {
        // Get the movie ID from the clicked image's data attribute
        const movieId = $(this).data('tmdb-id');
        // Fetch recommendations for the selected movie
        getMovieRecommendations(movieId);
    });

    // Function to search for movies using the TMDB API
    function searchMovie(movieName, movieYear) {
        const apiKey = '06913f82fcdc1886d498b562028e1b66';
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`;

        // Append the movie year to the URL if provided
        if (movieYear) {
            url += `&year=${movieYear}`;
        }

        // Fetch movie data from TMDB API
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Display search results based on the fetched data
                displaySearchResults(data.results);
            });

        // Function to display search results in the DOM
        function displaySearchResults(results) {
            const searchResultsDiv = $('#searchResults');
            searchResultsDiv.empty(); // Clear any previous search results

            // If no results are found, display a message
            if (results.length === 0) {
                searchResultsDiv.text('No results found.');
                return;
            }

            // Create a list to hold the search result images
            const resultList = $('<ul></ul>').css('list-style', 'none').css('padding', '0').css('margin', '0');

            // Iterate through the results and create list items with movie posters
            $.each(results, function (index, movie) {
                if (movie.poster_path) {
                    const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                    const listItem = $('<li></li>')
                        .css('display', 'inline-block')
                        .css('margin', '5px')
                        .append(
                            $('<img>')
                                .addClass('movie-poster')
                                .attr('src', imageUrl)
                                .attr('alt', movie.title)
                                .data('tmdb-id', movie.id)
                        );
                    resultList.append(listItem);
                }
            });

            // Append the list of movie posters to the search results container
            searchResultsDiv.append(resultList);
        }
    }

    // Function to get movie recommendations using the WatchThis API
    function getMovieRecommendations(movieId) {
        const API_KEY = 'c48b27dfdbmsh0f42e66a3743370p15a5bbjsn7d8a440d2974';
        const url = `https://watchthis.p.rapidapi.com/api/v1/movie?ids=${movieId}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'watchthis.p.rapidapi.com',
            },
        };

        // Fetch movie recommendations using the WatchThis API
        fetch(url, options)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Log movie recommendations to the console
                console.log('Movie recommendations from WatchThis API:', data);
            });
    }
});
