import { handleFormSubmit } from './app.js';
import '../styles/style.scss';

const setupEventListeners = () => {
    // Assuming there's a form with id 'trip_form' to handle submissions
    const form = document.getElementById('trip_form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

};

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupEventListeners);
export {handleFormSubmit}