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
}
