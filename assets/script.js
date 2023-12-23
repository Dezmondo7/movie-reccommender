$(document).ready(function () {
    $('#searchButton').on('click', function (e) {
        e.preventDefault();
        const movieName = $('#movieNameInput').val();
        const movieYear = $('#movieYearInput').val();

        searchMovie(movieName, movieYear);
    });
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

// Code to attach the Movie Trailer to Modal
$('#myModalButton').on('click', function () {
    const src = 'http://www.youtube.com/v/FSi2fJALDyQ&amp;autoplay=1';
    $("#videoModalLabel").text("movieName");
    $('#videoModal source').attr('src', src);
});



