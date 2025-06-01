// JavaScript for page navigation and authentication logic

// Import translations from a separate file
import { translations } from '../js/translations.js'; // Updated path

// DOM Elements (specific to each page - will be null if not on that page)
// For index.html
const signInFromSplashBtn = document.getElementById('signInFromSplash');
const getStartedBtn = document.getElementById('getStartedBtn');
const splashEmailInput = document.getElementById('splashEmail');
const getStartedFaqBtn = document.getElementById('getStartedFaqBtn');
const faqEmailInput = document.getElementById('faqEmail');
const ctaEmailInput = document.getElementById('ctaEmail');
const ctaGetStartedBtn = document.getElementById('ctaGetStartedBtn');
const languageSelect = document.getElementById('languageSelect');

// For signin.html (these will only exist on signin.html)
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const authEmailInput = document.getElementById('authEmail');
const authPasswordInput = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authErrorMessage = document.getElementById('authErrorMessage');
const toggleAuthModeLink = document.getElementById('toggleAuthMode'); // This is the element we're debugging

let isSignUpMode = false; // To toggle between sign-in and sign-up on signin.html

/**
 * Applies the selected language translations to the page elements.
 * @param {string} lang - The language code (e.g., 'en', 'hi', 'mr').
 * @param {HTMLElement} [scopeElement=document] - The DOM element to limit the translation scope (default is entire document).
 */
function applyLanguage(lang, scopeElement = document) {
    const currentTranslations = translations[lang];

    // Update text content based on data-key attributes within the specified scope
    scopeElement.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (currentTranslations[key]) {
            // Special handling for placeholder text
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', currentTranslations[key]);
            } else {
                element.innerHTML = currentTranslations[key]; // Use innerHTML for text that might contain <br>
            }
        }
    });

    // Specific updates for elements that might not be covered by data-key or need dynamic logic
    // This part is now primarily for signin.html
    if (scopeElement.id === 'auth-page') {
        // Ensure the toggle link's text is correctly set based on the current mode
        if (toggleAuthModeLink) {
            if (isSignUpMode) {
                authTitle.textContent = currentTranslations.authSignUpTitle;
                authSubmitBtn.textContent = currentTranslations.authSignUpBtn;
                toggleAuthModeLink.textContent = currentTranslations.authSignInNow;
                console.log('applyLanguage: Set toggle link to Sign in now.'); // Debug log
            } else {
                authTitle.textContent = currentTranslations.authSignInTitle;
                authSubmitBtn.textContent = currentTranslations.authSignInBtn;
                toggleAuthModeLink.textContent = currentTranslations.authSignUpNow;
                console.log('applyLanguage: Set toggle link to Sign up now.'); // Debug log
            }
        } else {
            console.log('applyLanguage: toggleAuthModeLink is null on auth-page.'); // Debug log
        }
    }
}

// --- Utility Functions ---

/**
 * Displays an error message on the auth page.
 * @param {string} messageKey - The key for the error message in translations.
 */
function displayAuthError(messageKey) {
    // This function will only be called from signin.html
    if (authErrorMessage && translations[localStorage.getItem('netflixLanguage') || 'en'][messageKey]) {
        authErrorMessage.textContent = translations[localStorage.getItem('netflixLanguage') || 'en'][messageKey];
        authErrorMessage.style.display = 'block';
        console.log('Displaying error:', translations[localStorage.getItem('netflixLanguage') || 'en'][messageKey]); // Debug log
    }
}

/**
 * Clears any displayed error message on the auth page.
 */
function clearAuthError() {
    // This function will only be called from signin.html
    if (authErrorMessage) {
        authErrorMessage.textContent = '';
        authErrorMessage.style.display = 'none';
        console.log('Cleared error message.'); // Debug log
    }
}

/**
 * Simulates user registration. Stores user credentials in localStorage.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} True if registration is successful, false otherwise (e.g., user already exists).
 */
function registerUser(email, password) {
    let users = JSON.parse(localStorage.getItem('netflixUsers')) || [];
    if (users.some(user => user.email === email)) {
        console.log('Registration failed: User already exists.'); // Debug log
        return false; // User already exists
    }
    users.push({ email, password });
    localStorage.setItem('netflixUsers', JSON.stringify(users));
    console.log('User registered successfully:', email); // Debug log
    return true;
}

/**
 * Simulates user login. Checks credentials against stored users.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} True if login is successful, false otherwise.
 */
function loginUser(email, password) {
    let users = JSON.parse(localStorage.getItem('netflixUsers')) || [];
    const found = users.some(user => user.email === email && user.password === password);
    console.log('Login attempt for', email, ':', found ? 'Successful' : 'Failed'); // Debug log
    return found;
}

/**
 * Sets the current "logged in" state in localStorage.
 * @param {string} email - The email of the logged-in user.
 */
function setLoggedInUser(email) {
    localStorage.setItem('loggedInUser', email);
    console.log('User logged in:', email); // Debug log
}

/**
 * Gets the current "logged in" user from localStorage.
 * @returns {string|null} The email of the logged-in user, or null if no one is logged in.
 */
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    console.log('Current logged in user:', user); // Debug log
    return user;
}

/**
 * Clears the "logged in" state.
 */
function clearLoggedInUser() {
    localStorage.removeItem('loggedInUser');
    console.log('User logged out.'); // Debug log
}

/**
 * Generates dummy movie data.
 * @param {number} count - Number of movies to generate.
 * @returns {Array<Object>} An array of movie objects.
 */
function generateDummyMovies(count) {
    const movies = [];
    for (let i = 1; i <= count; i++) {
        movies.push({
            id: i,
            title: `Movie Title ${i}`, // Keeping these static for simplicity
            imageUrl: `https://placehold.co/200x120/303030/FFFFFF?text=Movie+${i}`
        });
    }
    return movies;
}

/**
 * Renders movie rows on the main content page (browse.html).
 */
function renderMovieRows() {
    if (!movieRowsContainer) {
        console.log('movieRowsContainer not found, skipping renderMovieRows.'); // Debug log
        return; // Ensure element exists on this page
    }

    movieRowsContainer.innerHTML = ''; // Clear existing rows
    console.log('Rendering movie rows...'); // Debug log

    const currentLang = localStorage.getItem('netflixLanguage') || 'en';

    const categories = [
        { titleKey: 'trendingNow', movies: generateDummyMovies(10) },
        { titleKey: 'newReleases', movies: generateDummyMovies(8) },
        { titleKey: 'actionMovies', movies: generateDummyMovies(12) },
        { titleKey: 'comedies', movies: generateDummyMovies(9) },
        { titleKey: 'criticallyAcclaimed', movies: generateDummyMovies(11) }
    ];

    categories.forEach(category => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('movie-row');

        const titleElement = document.createElement('h3');
        titleElement.textContent = translations[currentLang][category.titleKey];
        rowDiv.appendChild(titleElement);

        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('d-flex', 'flex-nowrap'); // Use flex-nowrap to keep cards in a single row

        category.movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card', 'rounded-lg');
            movieCard.innerHTML = `<img src="${movie.imageUrl}" alt="${movie.title}">`;
            cardsContainer.appendChild(movieCard);
        });
        rowDiv.appendChild(cardsContainer);
        movieRowsContainer.appendChild(rowDiv);
    });
}


// --- Event Handlers (Page-specific) ---

// Event listeners for index.html (only attach if elements exist)
if (signInFromSplashBtn) {
    signInFromSplashBtn.addEventListener('click', () => {
        localStorage.setItem('authMode', 'signIn'); // Store preference for signin.html
        window.location.href = 'signin.html'; // Redirect to signin page
        console.log('Redirecting to signin.html (Sign In mode).'); // Debug log
    });
}

if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        const email = splashEmailInput.value.trim();
        if (email) {
            localStorage.setItem('prefillEmail', email); // Store email to prefill
        }
        localStorage.setItem('authMode', 'signUp'); // Store preference for signin.html
        window.location.href = 'signin.html'; // Redirect to signin page
        console.log('Redirecting to signin.html (Sign Up mode) with email:', email); // Debug log
    });
}

if (getStartedFaqBtn) {
    getStartedFaqBtn.addEventListener('click', () => {
        const email = faqEmailInput.value.trim();
        if (email) {
            localStorage.setItem('prefillEmail', email); // Store email to prefill
        }
        localStorage.setItem('authMode', 'signUp'); // Store preference for signin.html
        window.location.href = 'signin.html'; // Redirect to signin page
        console.log('Redirecting to signin.html (Sign Up mode) from FAQ with email:', email); // Debug log
    });
}

if (ctaGetStartedBtn) {
    ctaGetStartedBtn.addEventListener('click', () => {
        const email = ctaEmailInput.value.trim();
        if (email) {
            localStorage.setItem('prefillEmail', email); // Store email to prefill
        }
        localStorage.setItem('authMode', 'signUp'); // Store preference for signin.html
        window.location.href = 'signin.html'; // Redirect to signin page
        console.log('Redirecting to signin.html (Sign Up mode) from CTA with email:', email); // Debug log
    });
}

if (languageSelect) { // Only on index.html
    languageSelect.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        localStorage.setItem('netflixLanguage', selectedLang); // Save selected language
        applyLanguage(selectedLang, document); // Apply new language to the current page
        console.log('Language changed to:', selectedLang); // Debug log
    });
}


// Event listeners for signin.html (only attach if elements exist)
if (authForm) {
    authForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Auth form submitted.'); // Debug log

        clearAuthError(); // Clear previous errors

        const email = authEmailInput.value.trim();
        const password = authPasswordInput.value.trim();

        if (!email || !password) {
            displayAuthError('enterBothFields');
            return;
        }

        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            displayAuthError('invalidEmailFormat');
            return;
        }

        if (isSignUpMode) {
            // Sign Up Logic
            console.log('Attempting to register user:', email); // Debug log
            if (registerUser(email, password)) {
                // After successful registration, we should ideally log them in and redirect,
                // or show a success message and then switch to sign-in form.
                // For now, let's log them in directly as per previous logic.
                setLoggedInUser(email); // Log them in immediately
                window.location.href = 'browse.html'; // Redirect to browse page
            } else {
                displayAuthError('userExists');
            }
        } else {
            // Sign In Logic
            console.log('Attempting to sign in user:', email); // Debug log
            if (loginUser(email, password)) {
                setLoggedInUser(email); // Store logged-in user
                window.location.href = 'browse.html'; // Redirect to browse page
            } else {
                displayAuthError('invalidEmailOrPassword');
            }
        }
    });
}

if (toggleAuthModeLink) {
    toggleAuthModeLink.addEventListener('click', () => {
        isSignUpMode = !isSignUpMode;
        const currentLang = localStorage.getItem('netflixLanguage') || 'en';
        console.log('Toggle auth mode clicked. isSignUpMode now:', isSignUpMode); // Debug log

        // Explicitly update the text content of the toggle link
        if (isSignUpMode) {
            authTitle.textContent = translations[currentLang].authSignUpTitle;
            authSubmitBtn.textContent = translations[currentLang].authSignUpBtn;
            toggleAuthModeLink.textContent = translations[currentLang].authSignInNow;
        } else {
            authTitle.textContent = translations[currentLang].authSignInTitle;
            authSubmitBtn.textContent = translations[currentLang].authSignInBtn;
            toggleAuthModeLink.textContent = translations[currentLang].authSignUpNow;
        }
        clearAuthError();
        authEmailInput.value = '';
        authPasswordInput.value = '';
    });
}

// Event listener for browse.html (only attach if elements exist)
if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        clearLoggedInUser();
        window.location.href = 'index.html'; // Redirect back to landing page
        console.log('Logout button clicked. Redirecting to index.html'); // Debug log
    });
}


// --- Initial Page Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop();
    const savedLang = localStorage.getItem('netflixLanguage');
    const initialLang = savedLang || 'en'; // Default to English if no saved language

    console.log('DOMContentLoaded fired. Current path:', currentPath); // Debug log
    console.log('Initial language:', initialLang); // Debug log

    // Apply language based on the current page
    if (currentPath === '' || currentPath === 'index.html') {
        // This is the landing page
        if (languageSelect) { // Check if languageSelect exists on this page
            languageSelect.value = initialLang;
            applyLanguage(initialLang, document);
        }
        // If user is logged in, redirect them to browse.html
        if (getLoggedInUser()) {
            console.log('User already logged in on index.html, redirecting to browse.html'); // Debug log
            window.location.href = 'browse.html';
        }
    } else if (currentPath === 'signin.html') {
        // This is the sign-in/sign-up page
        console.log('On signin.html page.'); // Debug log
        if (getLoggedInUser()) {
            console.log('User already logged in on signin.html, redirecting to browse.html'); // Debug log
            window.location.href = 'browse.html'; // Already logged in, redirect to browse
        } else {
            // Set isSignUpMode FIRST, before applying language
            const authMode = localStorage.getItem('authMode');
            if (authMode === 'signUp') {
                isSignUpMode = true;
                console.log('Auth mode from localStorage: signUp'); // Debug log
            } else {
                isSignUpMode = false; // Default to sign in if no specific mode or 'signIn'
                console.log('Auth mode from localStorage: signIn (default)'); // Debug log
            }
            localStorage.removeItem('authMode'); // Clear it after use

            applyLanguage(initialLang, document); // Apply language based on the determined isSignUpMode

            // Explicitly ensure the toggle link text is set after applyLanguage
            // This is a fallback to guarantee it appears
            const currentTranslations = translations[initialLang];
            if (toggleAuthModeLink) {
                console.log('toggleAuthModeLink element found.'); // Debug log
                if (isSignUpMode) {
                    toggleAuthModeLink.textContent = currentTranslations.authSignInNow;
                    console.log('Set toggle link text to:', currentTranslations.authSignInNow); // Debug log
                } else {
                    toggleAuthModeLink.textContent = currentTranslations.authSignUpNow;
                    console.log('Set toggle link text to:', currentTranslations.authSignUpNow); // Debug log
                }
            } else {
                console.error('Error: toggleAuthModeLink element not found on signin.html!'); // Critical debug log
            }


            const prefillEmail = localStorage.getItem('prefillEmail');
            if (prefillEmail) {
                authEmailInput.value = prefillEmail;
                localStorage.removeItem('prefillEmail'); // Clear it after use
                console.log('Prefilled email:', prefillEmail); // Debug log
            }
        }
    } else if (currentPath === 'browse.html') {
        // This is the main content page
        console.log('On browse.html page.'); // Debug log
        if (!getLoggedInUser()) {
            console.log('User not logged in on browse.html, redirecting to index.html'); // Debug log
            window.location.href = 'index.html'; // Not logged in, redirect to landing
        } else {
            applyLanguage(initialLang, document); // Apply language to browse page
            renderMovieRows(); // Render movies only on this page
        }
    }
});
