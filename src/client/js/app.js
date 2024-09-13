import { handleSubmit } from "./handleSubmit.js";

// Event Listeners
const form = document.getElementById('trip');
if (form) {
    form.addEventListener('submit', handleSubmit);
}


export {
    handleSubmit,
};






