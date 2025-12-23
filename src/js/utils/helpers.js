


function isEmptyString(str) {
    return !str || str.trim().length === 0;
}


function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}


function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}


function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
