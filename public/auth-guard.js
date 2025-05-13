document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const expirationTime = localStorage.getItem('loginExpiration');
  const currentTime = new Date().getTime();

  if (isLoggedIn !== 'true' || !expirationTime || currentTime > expirationTime) {
    window.location.href = '/';
  }
});