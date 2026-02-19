// Flight Search Block
import { getMetadata } from '../../scripts/aem.js';

// Sample airport data
const AIRPORTS = [
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw' },
  { code: 'LHR', name: 'London Heathrow', city: 'London' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
  { code: 'MBJ', name: 'Sangster International', city: 'Montego Bay' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam' },
  { code: 'TXL', name: 'Berlin Tegel', city: 'Berlin' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo' },
  { code: 'SFR', name: 'San Francisco International', city: 'San Francisco' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi' },
  { code: 'TQO', name: 'Tulum International', city: 'Tulum' },
];

// Sample flight data - in production, this would come from an API
const SAMPLE_FLIGHTS = {
  'AMS-TQO': [
    {
      id: '1',
      from: 'AMS',
      to: 'TQO',
      fromName: 'Amsterdam',
      toName: 'Tulum',
      departureTime: '5:15 PM',
      arrivalTime: '3:30 AM',
      price: 550.00,
      class: 'Standard',
      image: 'https://t4.ftcdn.net/jpg/03/30/53/47/240_F_330534715_1vke3762QI4yYRsnSXNaE8NGDUF8xzno.jpg',
    },
    {
      id: '2',
      from: 'AMS',
      to: 'TQO',
      fromName: 'Amsterdam',
      toName: 'Tulum',
      departureTime: '8:30 AM',
      arrivalTime: '6:45 PM',
      price: 625.00,
      class: 'Business',
      image: 'https://t3.ftcdn.net/jpg/17/40/03/60/240_F_1740036054_pyNaH8LuAe27d9KpFTZSjNAY844g6WJV.jpg',
    },
  ],
  'WAW-TQO': [
    {
      id: '3',
      from: 'WAW',
      to: 'TQO',
      fromName: 'Warsaw',
      toName: 'Tulum',
      departureTime: '10:00 AM',
      arrivalTime: '8:15 PM',
      price: 680.00,
      class: 'Standard',
      image: 'https://t4.ftcdn.net/jpg/16/22/86/51/240_F_1622865138_g9NtaEIxizg8ZY1bpNCqJiqbQl9mqFvB.jpg',
    },
  ],
};

// Utility functions
function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) {
    if (typeof content === 'string') {
      element.innerHTML = content;
    } else {
      element.appendChild(content);
    }
  }
  return element;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

function getTodayDate() {
  const today = new Date();
  return formatDate(today);
}

// Create airport dropdown
function createAirportDropdown(airports, selectedCode, placeholder, id) {
  const container = createElement('div', 'flight-input-group');
  const label = createElement('label', '', placeholder);
  label.setAttribute('for', id);
  
  const inputContainer = createElement('div', 'flight-input-container');
  const input = createElement('input', 'flight-input');
  input.type = 'text';
  input.id = id;
  input.placeholder = placeholder;
  input.value = selectedCode || '';
  input.readOnly = true;
  input.setAttribute('aria-label', placeholder);
  
  const dropdown = createElement('div', 'airport-dropdown');
  dropdown.style.display = 'none';
  
  airports.forEach((airport) => {
    const option = createElement('div', 'airport-option');
    option.dataset.code = airport.code;
    option.innerHTML = `
      <span class="airport-code">${airport.code}</span>
      <span class="airport-name">${airport.name}</span>
      <span class="airport-city">${airport.city}</span>
    `;
    option.addEventListener('click', () => {
      input.value = airport.code;
      dropdown.style.display = 'none';
      inputContainer.classList.remove('open');
      // Trigger search if both fields are filled
      const searchBtn = document.querySelector('.flight-search-button');
      if (searchBtn) {
        const fromInput = document.getElementById('flight-from');
        const toInput = document.getElementById('flight-to');
        if (fromInput.value && toInput.value) {
          // Auto-search can be enabled here if needed
        }
      }
    });
    dropdown.appendChild(option);
  });
  
  input.addEventListener('click', (e) => {
    e.stopPropagation();
    const allDropdowns = document.querySelectorAll('.airport-dropdown');
    allDropdowns.forEach((dd) => {
      if (dd !== dropdown) {
        dd.style.display = 'none';
        dd.parentElement.classList.remove('open');
      }
    });
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    inputContainer.classList.toggle('open');
  });
  
  inputContainer.appendChild(input);
  inputContainer.appendChild(dropdown);
  container.appendChild(label);
  container.appendChild(inputContainer);
  
  return container;
}

// Create date picker
function createDatePicker(selectedDate, id) {
  const container = createElement('div', 'flight-input-group');
  const label = createElement('label', '', 'Date');
  label.setAttribute('for', id);
  
  const inputContainer = createElement('div', 'flight-input-container');
  const input = createElement('input', 'flight-input');
  input.type = 'date';
  input.id = id;
  input.value = selectedDate || '';
  input.min = getTodayDate();
  input.setAttribute('aria-label', 'Date');
  
  inputContainer.appendChild(input);
  container.appendChild(label);
  container.appendChild(inputContainer);
  
  return container;
}

// Create search form
function createFlightSearchForm() {
  const form = createElement('form', 'flight-search-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch();
  });
  
  const searchRow = createElement('div', 'flight-search-row');
  
  // From dropdown
  const fromGroup = createAirportDropdown(AIRPORTS, '', 'From', 'flight-from');
  searchRow.appendChild(fromGroup);
  
  // To dropdown
  const toGroup = createAirportDropdown(AIRPORTS, '', 'To', 'flight-to');
  searchRow.appendChild(toGroup);
  
  // Date picker
  const dateGroup = createDatePicker('', 'flight-date');
  searchRow.appendChild(dateGroup);
  
  // Search button
  const buttonGroup = createElement('div', 'flight-button-group');
  const searchButton = createElement('button', 'flight-search-button', 'Search');
  searchButton.type = 'submit';
  buttonGroup.appendChild(searchButton);
  searchRow.appendChild(buttonGroup);
  
  form.appendChild(searchRow);
  
  // Options row
  const optionsRow = createElement('div', 'flight-options-row');
  const options = [
    { id: 'business-trip', label: 'Business Trip' },
    { id: 'business-class', label: 'Business Class' },
    { id: 'travelling-children', label: 'Travelling with children' },
  ];
  
  options.forEach((option) => {
    const optionContainer = createElement('div', 'flight-option');
    const checkbox = createElement('input', 'flight-checkbox');
    checkbox.type = 'checkbox';
    checkbox.id = option.id;
    checkbox.name = option.id;
    
    const label = createElement('label', '', option.label);
    label.setAttribute('for', option.id);
    
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    optionsRow.appendChild(optionContainer);
  });
  
  form.appendChild(optionsRow);
  
  return form;
}

// Handle search
function handleSearch() {
  const fromInput = document.getElementById('flight-from');
  const toInput = document.getElementById('flight-to');
  const dateInput = document.getElementById('flight-date');
  
  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  const date = dateInput.value;
  
  if (!from || !to) {
    alert('Please select both From and To airports');
    return;
  }
  
  if (!date) {
    alert('Please select a date');
    return;
  }
  
  // Get flight results
  const route = `${from}-${to}`;
  const flights = SAMPLE_FLIGHTS[route] || [];
  
  // Display results
  displayFlightResults(flights, from, to, date);
}

// Display flight results
function displayFlightResults(flights, from, to, date) {
  const resultsContainer = document.querySelector('.flight-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  if (flights.length === 0) {
    const noResults = createElement('div', 'flight-no-results');
    noResults.innerHTML = `
      <p>No flights found for ${from} to ${to} on ${formatDate(date)}</p>
      <p>Please try different airports or dates.</p>
    `;
    resultsContainer.appendChild(noResults);
    return;
  }
  
  // Title
  const title = createElement('h2', 'flight-results-title');
  const fromAirport = AIRPORTS.find((a) => a.code === from);
  const toAirport = AIRPORTS.find((a) => a.code === to);
  title.textContent = `One-Way connections from ${fromAirport?.city || from} to ${toAirport?.city || to}`;
  resultsContainer.appendChild(title);
  
  // Disclaimer
  const disclaimer = createElement('p', 'flight-results-disclaimer');
  disclaimer.textContent = 'Presented fares are per passenger, including fees and taxes. Additional services and amenities may vary per flight or change in time.';
  resultsContainer.appendChild(disclaimer);
  
  // Results list
  const resultsList = createElement('div', 'flight-results-list');
  
  flights.forEach((flight) => {
    const flightCard = createElement('div', 'flight-card');
    
    const imageContainer = createElement('div', 'flight-card-image');
    const image = createElement('img', '');
    image.src = flight.image;
    image.alt = `${flight.toName} destination`;
    imageContainer.appendChild(image);
    
    const detailsContainer = createElement('div', 'flight-card-details');
    
    const route = createElement('div', 'flight-route');
    route.textContent = `${flight.fromName} (${flight.from}) to ${flight.toName} (${flight.to})`;
    
    const times = createElement('div', 'flight-times');
    times.innerHTML = `
      <div class="flight-time">
        <span class="flight-airport">${flight.from}</span>
        <span class="flight-time-value">${flight.departureTime}</span>
      </div>
      <div class="flight-time">
        <span class="flight-airport">${flight.to}</span>
        <span class="flight-time-value">${flight.arrivalTime}</span>
      </div>
    `;
    
    detailsContainer.appendChild(route);
    detailsContainer.appendChild(times);
    
    const priceContainer = createElement('div', 'flight-card-price');
    const priceClass = createElement('div', 'flight-class');
    priceClass.textContent = flight.class;
    
    const price = createElement('div', 'flight-price');
    price.textContent = `$${flight.price.toFixed(2)}`;
    
    const selectButton = createElement('button', 'flight-select-button', 'Select');
    selectButton.addEventListener('click', () => {
      handleFlightSelect(flight);
    });
    
    priceContainer.appendChild(priceClass);
    priceContainer.appendChild(price);
    priceContainer.appendChild(selectButton);
    
    flightCard.appendChild(imageContainer);
    flightCard.appendChild(detailsContainer);
    flightCard.appendChild(priceContainer);
    
    resultsList.appendChild(flightCard);
  });
  
  resultsContainer.appendChild(resultsList);
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Handle flight selection
function handleFlightSelect(flight) {
  // In production, this would navigate to booking page or show booking modal
  console.log('Selected flight:', flight);
  alert(`Selected flight from ${flight.from} to ${flight.to} for $${flight.price.toFixed(2)}`);
  
  // You can add navigation or modal here
  // window.location.href = `/book-flight?id=${flight.id}`;
}

// Close dropdowns when clicking outside
function setupClickOutside() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.flight-input-container')) {
      const dropdowns = document.querySelectorAll('.airport-dropdown');
      dropdowns.forEach((dropdown) => {
        dropdown.style.display = 'none';
        dropdown.parentElement.classList.remove('open');
      });
    }
  });
}

// Main decorate function
export default async function decorate(block) {
  // Clear block
  block.innerHTML = '';
  block.className = 'flight-search';
  
  // Create search form
  const form = createFlightSearchForm();
  block.appendChild(form);
  
  // Create results container
  const resultsContainer = createElement('div', 'flight-results');
  block.appendChild(resultsContainer);
  
  // Setup click outside handler
  setupClickOutside();
  
  // Check for URL parameters to pre-fill form
  const urlParams = new URLSearchParams(window.location.search);
  const fromParam = urlParams.get('from');
  const toParam = urlParams.get('to');
  const dateParam = urlParams.get('date');
  
  if (fromParam) {
    const fromInput = document.getElementById('flight-from');
    if (fromInput) fromInput.value = fromParam;
  }
  
  if (toParam) {
    const toInput = document.getElementById('flight-to');
    if (toInput) toInput.value = toParam;
  }
  
  if (dateParam) {
    const dateInput = document.getElementById('flight-date');
    if (dateInput) dateInput.value = dateParam;
  }
  
  // Auto-search if all parameters are present
  if (fromParam && toParam && dateParam) {
    setTimeout(() => {
      handleSearch();
    }, 100);
  }
}

