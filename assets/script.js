
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

        // Create Heading Tags for Recommended Movies
        const recommendationHeadingEl = $('<h4></h4>').attr('id', 'recommendationHeading').text('Movie Recommendations: ')

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
                            .data('tmdb-id', movie.tmdb_id) // Store the movie ID as data attribute
                    );
                resultList.append(listItem); // Append each movie poster to the list
            }
        });

        recommendedMoviesDiv.append(recommendationHeadingEl, resultList); // Append the list of movie posters to the container
    }


    let youtubePlayer = null; // Define a global variable to store the YouTube player reference
    // Function to play the movie trailer from YouTube Data API
    function playMovieTrailer(movieTitle) {

        const apiKey = 'AIzaSyCq21SQXVzzJoeJI6DDRIgKZNtaAtLUUt0';
        const encodedTitle = encodeURIComponent(movieTitle);
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodedTitle}+trailer&key=${apiKey}`;

        fetch(searchUrl)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // Check if there are any video results
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId; // Get the video ID of the first result
                    const trailerSrc = `https://www.youtube.com/embed/${videoId}`;
                    // Set the trailer source and update modal title
                    $('#videoModalLabel').text(movieTitle);
                    $('#videoModal iframe').attr('src', trailerSrc);
                    // Show the modal
                    $('#videoModal').modal('show');

                    // Create a new YouTube player when the modal is shown
                    youtubePlayer = new YT.Player('videoPlayer', {
                        events: {
                            'onReady': onPlayerReady
                        }
                    });
                } else {
                    console.error('No trailer available for this movie.');
                    // Log error when there's no trailer available
                }
            })
            .catch((error) => {
                console.error('Error fetching movie trailer:', error);
                // Log error when there is a problem fetching trailer
            });
    }

    // Click event for movie posters to play the trailer
    $('#recommendedMovies').on('click', 'img.movie-poster', function () {
        const movieTitle = $(this).attr('alt');
        playMovieTrailer(movieTitle);
    });


    function onPlayerReady(event) {

        event.target.playVideo();
    }

    // Stop video playing when Modal is closed
    $('#videoModal').on('hidden.bs.modal', function () {
        var memory = $(this).html();
        $(this).html(memory);
    });

    // function to save movie information to local storage
    function saveToLocalStorage(movieInfo) {

        // Retrieve existing watchlist from local storage or initialize an empty array
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        // Add the new movie information to the watchlist
        watchlist.push(movieInfo);

        // Save the updated watchlist back to local storage
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }


    // Function to display watchlist items in the scroll container
    function displayWatchlist() {
        var watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        $('#watchlist-container').empty();

        // Loop through each movie in the watchlist and add it to the scroll container
        watchlist.forEach(function (movieInfo) {
            var watchlistDiv = $('<div class="container">');

            imagePoster = $('<img>')
                .addClass('image')
                .attr('src', movieInfo.image)
                .attr('alt', movieInfo.title)

            watchlistDiv.append(imagePoster);
            watchlistDiv.append('<div class="overlay">' +
                '<a href="#" data-bs-toggle="tooltip" title="Play Movie" class="play-movie">' +
                '<i class="material-symbols-outlined">play_arrow</i></a>' +
                '<a href="#" data-bs-toggle="tooltip" title="Remove From Watchlist" class="delete-movie">' +
                '<i class="material-symbols-outlined">close</i></a>' +
                '</div>');


            // needs more work
            watchlistDiv.find('.play-movie').click(function () {

                console.log('Play movie: ' + movieInfo.title);
            });

            // Event listener for removing movies from watchlist
            watchlistDiv.find('.delete-movie').click(function () {
                watchlist = watchlist.filter(function (item) {
                    return item.title !== movieInfo.title;
                });
                localStorage.setItem('watchlist', JSON.stringify(watchlist));

                // Update the display
                displayWatchlist();
            })

            $('#watchlist-container').append(watchlistDiv)


        });
    }

    // Event listener for "Add to Watchlist" button in the modal
    $('#myWatchlist').click(function () {
        // Get movie information from the modal (you may need to adjust this part based on your modal structure)
        var movieInfo = {
            title: $('#videoModalLabel').text(),
            image: $('#recommendedMovies img.movie-poster').attr('src')
        };

        // Save the movie information to local storage
        saveToLocalStorage(movieInfo);

        // Display the updated watchlist
        displayWatchlist();

        alert('Movie added to watchlist!');


    });


    displayWatchlist();





    // trigger Tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

});