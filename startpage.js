window.addEventListener("DOMContentLoaded", () => {


  const searchInput = document.getElementById('searchInput');
  // searchInput.focus();
  const clockdiv = document.querySelector('.clock');
  const clockoptions = document.querySelector('.clockoptions');
  const cardsContainer = document.getElementById('cardsContainer');
  const engineLabel = document.getElementById('engineLabel');

  const img = document.querySelector('.bgi');
  const colorThief = new ColorThief();
  const palletes = colorThief.getPalette(img, 6)

  //Time Update Fuctionn
  const updateClock = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockdiv.textContent = `${hours}:${minutes}`;
  };

  clockdiv.addEventListener('click', () => {
    clockoptions.classList.toggle('show');
    updateClock();
  })


  setInterval(updateClock, 1000);
  updateClock(); // Initial call to set the clock immediately

  setTimeout(() => {
    searchInput.focus();
    // Move cursor to end of text
    const len = searchInput.value.length;
    searchInput.setSelectionRange(len, len);
  }, 10); // Delay may help override address bar focus

  const links = {
    youtube: 'https://www.youtube.com',
    reddit: 'https://www.reddit.com',
    google: 'https://www.google.com',
    chatgpt: 'https://chat.openai.com',
    monkeytype: 'https://monkeytype.com',
    collab: 'https://colab.research.google.com',
    mangareader: 'https://mangareader.to',
  };

  let currentEngine = ['g', 'd', 'y', 'm']; // g for Google, y for YouTube
  let engineIndex = 0;
  let selectEngine = currentEngine[0]
  let suggestions = [];
  let suggestionIndex = 0;

  // Load saved search engine preference
  if (window.settingsManager) {
    const settings = window.settingsManager.loadSettings();
    engineIndex = settings.searchEngineIndex || 0;
    selectEngine = settings.searchEngine || currentEngine[0];
    engineLabel.textContent = selectEngine + '/';
  }


  const createCards = () => {
    cardsContainer.innerHTML = '';
    Object.keys(links).forEach(key => {
      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = key;
      // let rgbValueCard = `rgb(${palletes[4][0]},${palletes[4][1]},${palletes[4][2]})`
      // card.style.backgroundColor = rgbValueCard;
      card.style.backdropFilter = `blur(50px)`;
      // card.style.color = "invert(100%)";
      card.onclick = () => window.location.href = links[key];
      cardsContainer.appendChild(card);
    });
  };

  const filterCards = (query) => {
    const allCards = cardsContainer.querySelectorAll('.card');
    suggestions = [];
    allCards.forEach(card => {
      const match = card.textContent.toLowerCase().includes(query.toLowerCase());
      card.style.display = match ? 'inline-block' : 'none';
      if (match) suggestions.push(card.textContent);
    });
    suggestionIndex = 0;
  };

  const searchEngine = (currEngine, query) => {
    if (currEngine === 'g') {
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`
    } else if (currEngine === 'd') {
      return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    } else if (currEngine === 'y') {
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    } else if (currEngine === "m") {
      return `https://mangareader.to/search?keyword=${query.replaceAll(" ", "+")}`
    }
  }


  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        searchInput.value = suggestions[0];
      } else if (suggestions.length > 1) {
        searchInput.value = suggestions[suggestionIndex % suggestions.length];
        suggestionIndex++;
      }
      filterCards(searchInput.value);
    } else if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (links[query]) {
        window.location.href = links[query];
      } else {
        //   const url = currentEngine === 'g' ?
        //     `https://www.google.com/search?q=${encodeURIComponent(query)}` :
        //     `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        var url = searchEngine(selectEngine, query)
        window.location.href = url;
        console.log(url);

      }
    } else if (e.key === 'ArrowDown') {
      engineIndex = (engineIndex + 1) % currentEngine.length;
      selectEngine = currentEngine[engineIndex];
      engineLabel.textContent = selectEngine + '/';
      // Save search engine preference
      if (window.settingsManager) {
        window.settingsManager.updateSetting('searchEngine', selectEngine);
        window.settingsManager.updateSetting('searchEngineIndex', engineIndex);
      }
    } else if (e.key === 'ArrowUp') {
      engineIndex = (engineIndex - 1 + currentEngine.length) % currentEngine.length;
      selectEngine = currentEngine[engineIndex];
      engineLabel.textContent = selectEngine + '/';
      // Save search engine preference
      if (window.settingsManager) {
        window.settingsManager.updateSetting('searchEngine', selectEngine);
        window.settingsManager.updateSetting('searchEngineIndex', engineIndex);
      }
    }
  });

  searchInput.addEventListener('input', (e) => {
    const raw = e.target.value;
    if (raw.startsWith('::')) {
      searchInput.value = raw.slice(2);
    }
    filterCards(searchInput.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' || e.key === 'Enter') {
      e.preventDefault();
      searchInput.focus();
      const length = searchInput.value.length;
      searchInput.setSelectionRange(length, length);
    }
  });

  searchInput.addEventListener('focus', () => {
    cardsContainer.classList.add('show');
  });

  createCards();

});

