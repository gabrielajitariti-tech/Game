// Preload script - runs in renderer context before web page loads
// Keeps Node.js APIs isolated from the renderer for security
window.addEventListener('DOMContentLoaded', () => {
  document.title = 'Dark Hollow';
});
