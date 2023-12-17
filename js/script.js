const API = "https://657ec1603e3f5b189464135a.mockapi.io/heroes";
const API_UNIVER = "https://657ec1603e3f5b189464135a.mockapi.io/universes";

const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

document.addEventListener("DOMContentLoaded", function () {
  getHeroes();
  document
    .querySelector(".heroes__form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addHero();
    });

  fetch(API_UNIVER, {
    method: METHOD.GET,
  })
    .then((response) => response.json())
    .then((data) => {
      const comicsSelect = document.getElementById("comicsSelect");
      data.forEach((comics) => {
        const option = document.createElement("option");
        option.value = comics.name;
        option.textContent = comics.name;
        comicsSelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Ошибка при загрузке данных о комиксах:", error)
    );
});

async function getHeroes() {
  try {
    const response = await fetch(API, {
      method: METHOD.GET,
    });
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error("Ошибка при загрузке данных о героях:", error);
  }
}

function renderTable(data) {
  const table = document
    .getElementById("heroesTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  data.forEach((hero) => {
    addRowToTable(table, hero);
  });
}

function addHero() {
  const nameInput = document.querySelector('[data-name="heroName"]');
  const comicsSelect = document.querySelector('[data-name="heroComics"]');
  const favouriteCheckbox = document.querySelector(
    '[data-name="heroFavourite"]'
  );
  const newHero = {
    name: nameInput.value,
    comics: comicsSelect.value,
    favourite: favouriteCheckbox.checked,
  };

  const existingHero = Array.from(
    document.querySelectorAll("#heroesTable tbody tr")
  ).find((row) =>
    row.querySelector("td:first-child").textContent.includes(newHero.name)
  );

  if (existingHero) {
    console.log(`Герой с именем ${newHero.name} уже существует.`);
    return;
  }

  fetch(API, {
    method: METHOD.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newHero),
  })
    .then((response) => response.json())
    .then((hero) => {
      const table = document
        .getElementById("heroesTable")
        .getElementsByTagName("tbody")[0];
      addRowToTable(table, hero);
      document.querySelector(".heroes__form").reset();
    })
    .catch((error) => console.error("Ошибка при добавлении героя:", error));
}

function addRowToTable(table, hero) {
  const newRow = table.insertRow(table.rows.length);
  const nameCell = newRow.insertCell(0);
  const comicsCell = newRow.insertCell(1);
  const favouriteCell = newRow.insertCell(2);
  const actionsCell = newRow.insertCell(3);

  nameCell.textContent = hero.name;
  comicsCell.textContent = hero.comics;
  favouriteCell.innerHTML = `<label class="heroFavouriteInput">Лучший: <input type="checkbox" ${
    hero.favourite ? "checked" : ""
  } onchange="updateHero('${hero.id}', this)"></label>`;
  actionsCell.innerHTML = `<button onclick="deleteHero('${hero.id}')">Удалить</button>`;
}

function updateHero(heroId, checkbox) {
  const newFavouriteStatus = checkbox.checked;

  fetch(`${API}/${heroId}`, {
    method: METHOD.PUT,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ favourite: newFavouriteStatus }),
  })
    .then((response) => response.json())
    .catch((error) =>
      console.error("Ошибка при обновлении данных о герое:", error)
    );
}

function deleteHero(heroId) {
  fetch(`${API}/${heroId}`, {
    method: METHOD.DELETE,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Ошибка при удалении героя: ${response.status} ${response.statusText}`
        );
      }
      getHeroes();
    })
    .catch((error) => console.error(error));
}
