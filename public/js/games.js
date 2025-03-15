async function fetchGames() {
	try {
	  const response = await fetch("./json/games.json");
	  const games = await response.json();
	  window.gamesData = games;
  
	  displayGames(games);
	  updateSearchBarPlaceholder(games.length);
	} catch (error) {
	  console.error("Error fetching games:", error);
	}
  }
  
  function displayGames(games) {
	const gamesContainer = document.getElementById("game-container");
	gamesContainer.innerHTML = "";

	const newTopGames = games.filter((game) => game.new || game.top);
	const otherGames = games.filter((game) => !game.new && !game.top);
	const allGames = [...newTopGames, ...otherGames];

	allGames.forEach((game) => {
		const gameDiv = document.createElement("div");
		gameDiv.className = "game";

		const gameImage = game.proxy
			? `/media/games/${game.image}`
			: `/cdn/${game.url}/${game.image}`;
		gameDiv.innerHTML = `
        <img src="${gameImage}" alt="${game.name}" loading="lazy" width="200" height="200" />
        <p>${game.name}</p>
      `;

		if (game.new) {
			gameDiv.querySelector("p").innerHTML += ' <span class="badge">New</span>';
		}
		if (game.top) {
			gameDiv.querySelector("p").innerHTML +=
				' <span class="badge">Hot 🔥</span>';
		}
		if (game.exp) {
			gameDiv.querySelector("p").innerHTML += ' <span class="badge">🧪</span>';
		}
		if (game.updated) {
			gameDiv.querySelector("p").innerHTML +=
				' <span class="badge">🆕 Updated</span>';
		}

		const imageElement = gameDiv.querySelector("img");
		imageElement.addEventListener("click", () => {
			if (game.proxy) {
				sessionStorage.setItem(
					"lpurl",
					__uv$config.prefix + __uv$config.encodeUrl(game.url),
				);
				sessionStorage.setItem("rawurl", `${game.url}`);
				window.location.href = "/./go";
			} else {
				window.location.href = `./play?game=${game.url}`;
			}
			if (game.exp) {
				alert("this game is experimental 🧪");
			}
		});

		gamesContainer.appendChild(gameDiv);
	});
}
  
  function searchGames(searchTerm) {
	const filteredGames = window.gamesData.filter((game) =>
	  game.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
  
	displayGames(filteredGames);
	updateSearchBarPlaceholder(filteredGames.length);
  }
  
  function updateSearchBarPlaceholder(count) {
	document.getElementById(
	  "search-input"
	).placeholder = `Search for ${count} games`;
  }
  
  document.getElementById("search-input").addEventListener("input", (event) => {
	searchGames(event.target.value);
  });
  
  document.addEventListener("DOMContentLoaded", fetchGames);