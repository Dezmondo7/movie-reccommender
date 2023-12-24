
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

            const limitedResults = results.slice(0, 6) // Display the first 6 results
            // Create a list to hold the search result images
            const resultList = $('<ul></ul>').css('list-style', 'none').css('padding', '0').css('margin', '0');

            // Iterate through the results and create list items with movie posters
            $.each(limitedResults, function (index, movie) {
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


    // Function to get movie recommendations using WatchThis API


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


        // Fetch movie recommendations using WatchThis API

        fetch(url, options)
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                const recommendations = data.related;

                if (Array.isArray(recommendations)) {
                    // If recommendations is an array
                    displayMovieRecommendations(recommendations);
                } else {
                    console.error('Invalid or empty recommendations data:', recommendations);
                    // Handle the case when recommendations are not as expected
                }
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);


            });
    }

    // Function to display movie recommendations based on provided data
    function displayMovieRecommendations(recommendations) {
        // Select the container for recommended movies
        const recommendedMoviesDiv = $('#recommendedMovies');
        recommendedMoviesDiv.empty(); // Clear any previous recommendations

        // Check if there are no recommendations
        if (recommendations.length === 0) {
            recommendedMoviesDiv.text('No recommendations found.'); // Display a message if there are no recommendations
            return; // Exit the function early if there are no recommendations
        }

        // Create a list to hold recommended movies' posters
        const resultList = $('<ul></ul>').css('list-style', 'none').css('padding', '0').css('margin', '0');

        // Loop through the recommendations to create list items with movie posters
        $.each(recommendations, function (index, movie) {
            // Check if the movie has a poster path available
            if (movie.tmdb_poster_path) {
                // Create the image URL using the movie's poster path
                const imageUrl = `https://image.tmdb.org/t/p/w200${movie.tmdb_poster_path}`;

                // Create a list item to hold the movie poster image
                const listItem = $('<li></li>')
                    .css('display', 'inline-block')
                    .css('margin', '5px')
                    .append(
                        // Create an image element for the movie poster
                        $('<img>')
                            .addClass('movie-poster')
                            .attr('src', imageUrl)
                            .attr('alt', movie.title)
                            .data('tmdb-id', movie.id) // Store the movie ID as data
                    );

                resultList.append(listItem); // Append each movie poster to the list
            }
        });

        recommendedMoviesDiv.append(resultList); // Append the list of movie posters to the container
    }

    searchResultsDiv.append(resultList);

    // Code to attach the Movie Trailer to Modal
    $('#myModalButton').on('click', function () {
        const src = 'http://www.youtube.com/v/FSi2fJALDyQ&amp;autoplay=1';
        $("#videoModalLabel").text("movieName");
        $('#videoModal source').attr('src', src);
    });


    //Code to remove the Movie Trailer once Modal is closed
    $('#exampleModal button.btn-close').on('hidden.bs.modal', function () {
        $('#exampleModal source').removeAttr('src');
    })





    // trigger Tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

});



