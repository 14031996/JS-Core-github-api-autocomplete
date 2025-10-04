class gitHubAPI {
  constructor() {
    this.BASE_URL = "https://api.github.com";
  }
  async getReps(query = "") {
    const response = await fetch(
      this.BASE_URL + "/search/repositories?q=" + query,
      {
        headers: {
          Authorization:
            "Bearer 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",
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const data = await response.json();
    return data;
  }
}

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;

    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

const api = new gitHubAPI();
const searchInputEl = document.querySelector(".search-input");
const autocompleteListEl = document.querySelector(".autocomplete-list");
const reposListEl = document.querySelector(".repos-list");
function renderAutoCompleteItems(reps) {
  let layout = "";
  reps.forEach((rep) => {
    layout += `<div class="autocomplete-item" data-owner="${rep.owner.login}" data-stars="${rep.stargazers_count}" >${rep.name}</div>`;
  });
  autocompleteListEl.innerHTML = layout;
}
function createRepoItem(name, owner, stars) {
  const repoItemEl = document.createElement("li");
  repoItemEl.className = "repo-item";
  repoItemEl.innerHTML = `<div class="repo-info">
            <span>Name: ${name} </span>
            <span>Owner: ${owner}</span>
            <span>Stars: ${stars}</span>
          </div>
          <button class="remove-btn">✖</button>`;
  repoItemEl
    .querySelector(".remove-btn")
    .addEventListener("click", () => repoItemEl.remove());
  return repoItemEl;
}
function toggleSearchInput(e) {
  const value = e.target.value;
  if (value.trim()) {
    api
      .getReps(value)
      .then((data) => renderAutoCompleteItems(data.items.slice(0, 5)));
  } else {
    autocompleteListEl.innerHTML = "";
  }
}
const debouncedToggleSearchInput = debounce(toggleSearchInput, 500);
searchInputEl.addEventListener("input", debouncedToggleSearchInput);

autocompleteListEl.addEventListener("click", (e) => {
  if (e.target.className == "autocomplete-item") {
    const repoItemEl = createRepoItem(
      e.target.textContent,
      e.target.dataset.owner,
      e.target.dataset.stars
    );
    reposListEl.append(repoItemEl);
    searchInputEl.value = "";
    autocompleteListEl.innerHTML = "";
  }
});


