export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}