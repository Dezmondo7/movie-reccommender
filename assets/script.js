$(document).ready(function (e) {
    $('#searchButton').on('click', function (e) {
        e.preventDefault();
        const movieName = $('#movieNameInput').val();
        const movieYear = $('#movieYearInput').val();

        searchMovie(movieName, movieYear);
    });

    // Event delegation for dynamically added images
    $('#searchResults').on('click', 'img.movie-poster', function () {
        const movieId = $(this).data('tmdb-id');
        getMovieRecommendations(movieId);
    });

    function searchMovie(movieName, movieYear) {
        const apiKey = '06913f82fcdc1886d498b562028e1b66';

        let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`;

        if (movieYear) {
            url += `&year=${movieYear}`;
        }

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                displaySearchResults(data.results);
            });

        function displaySearchResults(results) {
            const searchResultsDiv = $('#searchResults');
            searchResultsDiv.empty();

            if (results.length === 0) {
                searchResultsDiv.text('No results found.');
                return;
            }

            const resultList = $('<ul></ul>').css('list-style', 'none').css('padding', '0').css('margin', '0');

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

            searchResultsDiv.append(resultList);
        }

    }

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

        fetch(url, options)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log('Movie recommendations from WatchThis API:', data);
            });
    }
});
