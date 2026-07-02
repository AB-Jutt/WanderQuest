/* ================================================
   WanderQuest – script.js
   Main JavaScript for interactive features
   ================================================ */

// ══════════════════════════════════════════════════
// GLOBAL STATE & DATA
// ══════════════════════════════════════════════════

let map = null;
let markers = [];
let savedSpots = JSON.parse(localStorage.getItem('savedSpots')) || [];
let currentView = 'table';

// Mock tourism spots data
const touristsSpots = [
  {
    id: 1,
    name: "The Louvre Museum",
    category: "museum",
    location: "Paris, France",
    price: "mid",
    priceValue: 45,
    rating: 4.8,
    lat: 48.8606,
    lng: 2.3376,
    description: "World's largest art museum and historic monument"
  },
  {
    id: 2,
    name: "Grand Canyon",
    category: "nature",
    location: "Arizona, USA",
    price: "low",
    priceValue: 15,
    rating: 4.9,
    lat: 36.1069,
    lng: -112.1129,
    description: "Breathtaking natural wonder carved by the Colorado River"
  },
  {
    id: 3,
    name: "Taj Mahal",
    category: "heritage",
    location: "Agra, India",
    price: "low",
    priceValue: 10,
    rating: 4.7,
    lat: 27.1751,
    lng: 78.0421,
    description: "Iconic marble mausoleum and UNESCO World Heritage Site"
  },
  {
    id: 4,
    name: "Bondi Beach",
    category: "beach",
    location: "Sydney, Australia",
    price: "free",
    priceValue: 0,
    rating: 4.6,
    lat: -33.8908,
    lng: 151.2743,
    description: "Famous beach known for surfing and golden sands"
  },
  {
    id: 5,
    name: "Mount Everest Base Camp",
    category: "adventure",
    location: "Nepal",
    price: "high",
    priceValue: 1200,
    rating: 4.9,
    lat: 28.0026,
    lng: 86.8528,
    description: "Trekking destination at the foot of the world's highest peak"
  },
  {
    id: 6,
    name: "Tokyo Fish Market",
    category: "food",
    location: "Tokyo, Japan",
    price: "mid",
    priceValue: 30,
    rating: 4.5,
    lat: 35.6654,
    lng: 139.7707,
    description: "World's largest fish market with fresh sushi experiences"
  },
  {
    id: 7,
    name: "Machu Picchu",
    category: "heritage",
    location: "Cusco, Peru",
    price: "mid",
    priceValue: 55,
    rating: 4.9,
    lat: -13.1631,
    lng: -72.5450,
    description: "Ancient Incan citadel set high in the Andes Mountains"
  },
  {
    id: 8,
    name: "Serengeti National Park",
    category: "nature",
    location: "Tanzania",
    price: "high",
    priceValue: 80,
    rating: 4.8,
    lat: -2.3333,
    lng: 34.8333,
    description: "Vast wilderness area with incredible wildlife migrations"
  },
  {
    id: 9,
    name: "British Museum",
    category: "museum",
    location: "London, UK",
    price: "free",
    priceValue: 0,
    rating: 4.7,
    lat: 51.5194,
    lng: -0.1270,
    description: "World-famous museum of human history and culture"
  },
  {
    id: 10,
    name: "Santorini Beaches",
    category: "beach",
    location: "Santorini, Greece",
    price: "mid",
    priceValue: 40,
    rating: 4.8,
    lat: 36.3932,
    lng: 25.4615,
    description: "Stunning volcanic beaches with crystal blue waters"
  },
  {
    id: 11,
    name: "Patagonia Trek",
    category: "adventure",
    location: "Argentina/Chile",
    price: "high",
    priceValue: 950,
    rating: 4.9,
    lat: -50.9423,
    lng: -73.4068,
    description: "Epic hiking through dramatic mountains and glaciers"
  },
  {
    id: 12,
    name: "Street Food Tour Bangkok",
    category: "food",
    location: "Bangkok, Thailand",
    price: "low",
    priceValue: 20,
    rating: 4.6,
    lat: 13.7563,
    lng: 100.5018,
    description: "Authentic Thai street food experience in bustling markets"
  },
  {
    id: 13,
    name: "Yellowstone National Park",
    category: "nature",
    location: "Wyoming, USA",
    price: "low",
    priceValue: 25,
    rating: 4.8,
    lat: 44.4280,
    lng: -110.5885,
    description: "First national park with geysers, hot springs, and wildlife"
  },
  {
    id: 14,
    name: "The Colosseum",
    category: "heritage",
    location: "Rome, Italy",
    price: "mid",
    priceValue: 35,
    rating: 4.7,
    lat: 41.8902,
    lng: 12.4922,
    description: "Ancient Roman amphitheater and architectural marvel"
  },
  {
    id: 15,
    name: "Great Barrier Reef Diving",
    category: "adventure",
    location: "Queensland, Australia",
    price: "high",
    priceValue: 150,
    rating: 4.9,
    lat: -18.2871,
    lng: 147.6992,
    description: "World's largest coral reef system for diving adventures"
  }
];

let filteredSpots = [...touristsSpots];

// ══════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMap();
  initDestinations();
  initFilters();
  initPlanner();
  initGallery();
  initUIElements();
  updateSavedList();
});

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════

function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu on link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// ══════════════════════════════════════════════════
// MAP FUNCTIONALITY
// ══════════════════════════════════════════════════

function initMap() {
  // Initialize Leaflet map
  map = L.map('map').setView([20, 0], 2);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Hero locate button
  const locateBtn = document.getElementById('locateBtn');
  locateBtn?.addEventListener('click', getUserLocation);

  // Map section geo button
  const geoBtn = document.getElementById('geoBtn');
  geoBtn?.addEventListener('click', getUserLocation);

  // City search
  const searchCityBtn = document.getElementById('searchCityBtn');
  const cityInput = document.getElementById('cityInput');

  searchCityBtn?.addEventListener('click', () => searchCity(cityInput.value));
  cityInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity(cityInput.value);
  });

  // Add all spots to map
  displaySpotsOnMap(touristsSpots);
}

function getUserLocation() {
  const mapStatus = document.getElementById('mapStatus');
  
  if (!navigator.geolocation) {
    updateMapStatus('❌ Geolocation not supported by your browser');
    return;
  }

  updateMapStatus('📍 Getting your location...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 10);
      
      // Add user marker
      L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div style="background: #c9522a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
          iconSize: [20, 20]
        })
      }).addTo(map).bindPopup('<strong>You are here!</strong>');

      updateMapStatus('✅ Location found');
      setTimeout(() => updateMapStatus('📍 Explore spots near you'), 2000);

      // Fetch weather for user location
      fetchWeather(latitude, longitude);
    },
    (error) => {
      updateMapStatus('❌ Unable to get your location');
      showToast('Location access denied. Please enable location services.');
    }
  );
}

function searchCity(cityName) {
  if (!cityName.trim()) {
    showToast('Please enter a city name');
    return;
  }

  updateMapStatus('🔍 Searching for ' + cityName + '...');

  // Use Nominatim geocoding API (free)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        map.setView([lat, lon], 10);
        
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<strong>${display_name}</strong>`)
          .openPopup();
        
        updateMapStatus(`✅ Found: ${display_name}`);
        fetchWeather(lat, lon);
      } else {
        updateMapStatus('❌ City not found');
        showToast('City not found. Try another search.');
      }
    })
    .catch(err => {
      updateMapStatus('❌ Search failed');
      showToast('Search failed. Please try again.');
    });
}

function displaySpotsOnMap(spots) {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Add markers for each spot
  spots.forEach(spot => {
    const marker = L.marker([spot.lat, spot.lng])
      .bindPopup(`
        <strong>${spot.name}</strong><br>
        ${spot.location}<br>
        Rating: ${'⭐'.repeat(Math.round(spot.rating))}<br>
        <small>${spot.description}</small>
      `);
    
    marker.addTo(map);
    markers.push(marker);
  });
}

function updateMapStatus(message) {
  const mapStatus = document.getElementById('mapStatus');
  if (mapStatus) mapStatus.textContent = message;
}

// ══════════════════════════════════════════════════
// DESTINATIONS TABLE & CARDS
// ══════════════════════════════════════════════════

function initDestinations() {
  renderSpots();
  
  // View toggle buttons
  const tableViewBtn = document.getElementById('tableViewBtn');
  const cardViewBtn = document.getElementById('cardViewBtn');

  tableViewBtn?.addEventListener('click', () => switchView('table'));
  cardViewBtn?.addEventListener('click', () => switchView('cards'));
}

function renderSpots() {
  renderTable();
  renderCards();
  updateResultsCount();
}

function renderTable() {
  const tbody = document.getElementById('spotsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  filteredSpots.forEach(spot => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${spot.name}</strong></td>
      <td><span class="badge badge-${spot.category}">${getCategoryLabel(spot.category)}</span></td>
      <td>${spot.location}</td>
      <td>${getPriceDisplay(spot.price)}</td>
      <td>${spot.rating} ⭐</td>
      <td class="td-actions">
        <button class="action-btn save-btn" data-id="${spot.id}" title="${isSaved(spot.id) ? 'Unsave' : 'Save'}">
          ${isSaved(spot.id) ? '❤' : '♡'}
        </button>
        <button class="action-btn map-btn" data-id="${spot.id}" title="View on map">🗺</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Attach event listeners
  attachSpotActions();
}

function renderCards() {
  const grid = document.getElementById('spotsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  filteredSpots.forEach(spot => {
    const card = document.createElement('div');
    card.className = 'spot-card';
    card.innerHTML = `
      <div class="card-header">
        <h3>${spot.name}</h3>
        <button class="save-icon ${isSaved(spot.id) ? 'saved' : ''}" data-id="${spot.id}">
          ${isSaved(spot.id) ? '❤' : '♡'}
        </button>
      </div>
      <p class="card-location">📍 ${spot.location}</p>
      <p class="card-desc">${spot.description}</p>
      <div class="card-meta">
        <span class="badge badge-${spot.category}">${getCategoryLabel(spot.category)}</span>
        <span>${spot.rating} ⭐</span>
      </div>
      <div class="card-footer">
        <span class="card-price">${getPriceDisplay(spot.price)}</span>
        <button class="btn btn-ghost btn-sm map-btn" data-id="${spot.id}">View Map</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach event listeners
  attachSpotActions();
}

function attachSpotActions() {
  // Save buttons
  document.querySelectorAll('.save-btn, .save-icon').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      toggleSaveSpot(id);
    });
  });

  // Map buttons
  document.querySelectorAll('.map-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      viewSpotOnMap(id);
    });
  });
}

function switchView(view) {
  currentView = view;
  const table = document.querySelector('.table-wrapper');
  const grid = document.getElementById('spotsGrid');
  const tableBtn = document.getElementById('tableViewBtn');
  const cardBtn = document.getElementById('cardViewBtn');

  if (view === 'table') {
    table?.classList.remove('hidden');
    grid?.classList.add('hidden');
    tableBtn?.classList.add('active');
    cardBtn?.classList.remove('active');
    tableBtn?.setAttribute('aria-pressed', 'true');
    cardBtn?.setAttribute('aria-pressed', 'false');
  } else {
    table?.classList.add('hidden');
    grid?.classList.remove('hidden');
    tableBtn?.classList.remove('active');
    cardBtn?.classList.add('active');
    tableBtn?.setAttribute('aria-pressed', 'false');
    cardBtn?.setAttribute('aria-pressed', 'true');
  }
}

function getCategoryLabel(category) {
  const labels = {
    museum: 'Museums',
    nature: 'Nature',
    heritage: 'Heritage',
    beach: 'Beaches',
    adventure: 'Adventure',
    food: 'Food & Culture'
  };
  return labels[category] || category;
}

function getPriceDisplay(price) {
  const displays = {
    free: 'Free',
    low: '$ Budget',
    mid: '$$ Mid',
    high: '$$$ Premium'
  };
  return displays[price] || price;
}

// ══════════════════════════════════════════════════
// FILTERS & SORTING
// ══════════════════════════════════════════════════

function initFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortSelect = document.getElementById('sortSelect');
  const resetBtn = document.getElementById('resetFilters');

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  priceFilter?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);
  resetBtn?.addEventListener('click', resetFilters);

  // Table header sorting
  document.querySelectorAll('.th-sortable').forEach(th => {
    th.addEventListener('click', function() {
      const col = this.dataset.col;
      sortByColumn(col);
    });
  });
}

function applyFilters() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const category = document.getElementById('categoryFilter')?.value || '';
  const price = document.getElementById('priceFilter')?.value || '';
  const sort = document.getElementById('sortSelect')?.value || 'rating';

  // Filter
  filteredSpots = touristsSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm) ||
                          spot.location.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || spot.category === category;
    const matchesPrice = !price || spot.price === price;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort
  sortSpots(sort);

  // Update display
  renderSpots();
  displaySpotsOnMap(filteredSpots);
}

function sortSpots(sortBy) {
  switch(sortBy) {
    case 'rating':
      filteredSpots.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-asc':
      filteredSpots.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case 'price-desc':
      filteredSpots.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case 'name':
      filteredSpots.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
}

function sortByColumn(col) {
  const sortMap = {
    name: 'name',
    rating: 'rating',
    price: 'price-asc'
  };
  
  if (sortMap[col]) {
    document.getElementById('sortSelect').value = sortMap[col];
    applyFilters();
  }
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('priceFilter').value = '';
  document.getElementById('sortSelect').value = 'rating';
  applyFilters();
  showToast('Filters reset');
}

function updateResultsCount() {
  const count = filteredSpots.length;
  const total = touristsSpots.length;
  const resultsCount = document.getElementById('resultsCount');
  
  if (resultsCount) {
    if (count === total) {
      resultsCount.textContent = `Showing all ${total} spots`;
    } else {
      resultsCount.textContent = `Showing ${count} of ${total} spots`;
    }
  }
}

// ══════════════════════════════════════════════════
// SAVED SPOTS
// ══════════════════════════════════════════════════

function toggleSaveSpot(id) {
  const spot = touristsSpots.find(s => s.id === id);
  if (!spot) return;

  const index = savedSpots.findIndex(s => s.id === id);
  
  if (index > -1) {
    savedSpots.splice(index, 1);
    showToast(`Removed ${spot.name} from saved`);
  } else {
    savedSpots.push(spot);
    showToast(`Saved ${spot.name}`);
  }

  localStorage.setItem('savedSpots', JSON.stringify(savedSpots));
  updateSavedList();
  renderSpots(); // Re-render to update heart icons
}

function isSaved(id) {
  return savedSpots.some(s => s.id === id);
}

function updateSavedList() {
  const savedList = document.getElementById('savedList');
  if (!savedList) return;

  if (savedSpots.length === 0) {
    savedList.innerHTML = '<li class="empty-msg">No spots saved yet.</li>';
    return;
  }

  savedList.innerHTML = savedSpots.map(spot => `
    <li class="saved-item">
      <span>${spot.name}</span>
      <button class="remove-saved" data-id="${spot.id}">✕</button>
    </li>
  `).join('');

  // Attach remove listeners
  document.querySelectorAll('.remove-saved').forEach(btn => {
    btn.addEventListener('click', function() {
      toggleSaveSpot(parseInt(this.dataset.id));
    });
  });
}

function viewSpotOnMap(id) {
  const spot = touristsSpots.find(s => s.id === id);
  if (!spot) return;

  // Scroll to map section
  document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });

  // Center map on spot
  setTimeout(() => {
    map.setView([spot.lat, spot.lng], 12);
    
    // Find and open the marker popup
    markers.forEach(marker => {
      if (marker.getLatLng().lat === spot.lat && marker.getLatLng().lng === spot.lng) {
        marker.openPopup();
      }
    });
  }, 800);
}

// Clear all saved spots
document.getElementById('clearSaved')?.addEventListener('click', () => {
  if (savedSpots.length === 0) {
    showToast('No saved spots to clear');
    return;
  }

  if (confirm('Clear all saved spots?')) {
    savedSpots = [];
    localStorage.removeItem('savedSpots');
    updateSavedList();
    renderSpots();
    showToast('All saved spots cleared');
  }
});

// ══════════════════════════════════════════════════
// TRIP PLANNER FORM
// ══════════════════════════════════════════════════

function initPlanner() {
  const plannerForm = document.getElementById('plannerForm');
  const notesField = document.getElementById('notes');
  const charCount = document.getElementById('charCount');

  // Character counter
  notesField?.addEventListener('input', function() {
    const length = this.value.length;
    if (charCount) {
      charCount.textContent = `${length} / 300`;
    }
  });

  // Form submission
  plannerForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Show success modal
      const modalOverlay = document.getElementById('modalOverlay');
      modalOverlay?.classList.add('active');
      
      // Reset form
      this.reset();
      if (charCount) charCount.textContent = '0 / 300';
      clearFormErrors();
      
      showToast('Itinerary submitted successfully!');
    }
  });

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('modalOverlay')?.classList.remove('active');
  });

  // Close modal on overlay click
  document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
}

function validateForm() {
  let isValid = true;
  clearFormErrors();

  // Name validation
  const name = document.getElementById('name');
  if (!name?.value.trim()) {
    showFieldError('nameError', 'Name is required');
    isValid = false;
  }

  // Email validation
  const email = document.getElementById('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.value.trim()) {
    showFieldError('emailError', 'Email is required');
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    showFieldError('emailError', 'Please enter a valid email');
    isValid = false;
  }

  // Destination validation
  const destination = document.getElementById('destination');
  if (!destination?.value.trim()) {
    showFieldError('destinationError', 'Destination is required');
    isValid = false;
  }

  // Dates validation
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  if (!startDate?.value) {
    showFieldError('startDateError', 'Start date is required');
    isValid = false;
  }
  if (!endDate?.value) {
    showFieldError('endDateError', 'End date is required');
    isValid = false;
  }
  if (startDate?.value && endDate?.value) {
    if (new Date(endDate.value) < new Date(startDate.value)) {
      showFieldError('endDateError', 'End date must be after start date');
      isValid = false;
    }
  }

  // Travelers validation
  const travelers = document.getElementById('travelers');
  if (!travelers?.value || travelers.value < 1) {
    showFieldError('travelersError', 'Number of travelers is required');
    isValid = false;
  }

  // Budget validation
  const budget = document.getElementById('budget');
  if (!budget?.value) {
    showFieldError('budgetError', 'Please select a budget range');
    isValid = false;
  }

  // Travel style validation (at least one checkbox)
  const styleCheckboxes = document.querySelectorAll('input[name="style"]:checked');
  if (styleCheckboxes.length === 0) {
    showFieldError('styleError', 'Please select at least one travel style');
    isValid = false;
  }

  // Terms validation
  const terms = document.getElementById('terms');
  if (!terms?.checked) {
    showFieldError('termsError', 'You must agree to the terms');
    isValid = false;
  }

  return isValid;
}

function showFieldError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(error => {
    error.textContent = '';
  });
}

// ══════════════════════════════════════════════════
// WEATHER API
// ══════════════════════════════════════════════════

function fetchWeather(lat, lon) {
  const weatherCard = document.getElementById('weatherCard');
  if (!weatherCard) return;

  // Use Open-Meteo free weather API
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const weather = data.current_weather;
      const temp = Math.round(weather.temperature);
      const windSpeed = Math.round(weather.windspeed);
      
      const weatherDesc = getWeatherDescription(weather.weathercode);
      const weatherEmoji = getWeatherEmoji(weather.weathercode);
      
      weatherCard.innerHTML = `
        <h3>${weatherEmoji} Local Weather</h3>
        <div class="weather-info">
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${weatherDesc}</div>
          <div style="font-size: 0.85rem; color: var(--c-muted); margin-top: 6px;">
            Wind: ${windSpeed} km/h
          </div>
        </div>
      `;
    })
    .catch(err => {
      console.error('Weather fetch failed:', err);
    });
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    95: 'Thunderstorm'
  };
  return descriptions[code] || 'Unknown';
}

function getWeatherEmoji(code) {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌤';
}

// ══════════════════════════════════════════════════
// GALLERY & LIGHTBOX
// ══════════════════════════════════════════════════

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      const caption = this.dataset.caption || '';
      
      if (lightboxImg && lightbox) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      }
    });
  });

  // Close lightbox
  lightboxClose?.addEventListener('click', () => {
    lightbox?.classList.remove('active');
  });

  lightbox?.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

// ══════════════════════════════════════════════════
// UI ELEMENTS
// ══════════════════════════════════════════════════

function initUIElements() {
  // Back to top button
  const backTop = document.getElementById('backTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backTop?.classList.add('visible');
    } else {
      backTop?.classList.remove('visible');
    }
  });

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Toast notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════

// Add hidden class utility if not in CSS
if (!document.querySelector('.hidden')) {
  const style = document.createElement('style');
  style.textContent = '.hidden { display: none !important; }';
  document.head.appendChild(style);
}

// Console welcome message
console.log('%cWanderQuest 🗺️', 'color: #c9522a; font-size: 24px; font-weight: bold;');
console.log('%cExplore the world with confidence!', 'color: #e8a83e; font-size: 14px;');
