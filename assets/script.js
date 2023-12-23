// trigger Tooltip
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

//const API_KEY = 'bc9962c147msh449db8706885ddfp12c772jsn032f560cfdbc';
      const movieId = '109445';
      const url = `https://watchthis.p.rapidapi.com/api/v1/movie?ids=${movieId}`;
      const options = {
          method: 'GET',
          headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'watchthis.p.rapidapi.com',
          },
      };
      fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
              console.log('Movie Data:', data);
              // Process the movie data here
          });