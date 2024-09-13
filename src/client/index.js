import { handleSubmit } from './js/handleSubmit.js';

import './styles/main.scss'; 

const setupEventListeners = () => {
    const form = document.getElementById('trip');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
};

document.addEventListener('DOMContentLoaded', setupEventListeners);

export { handleSubmit };
