// ─── USER STORAGE ───────────────────────────────────────────────────────────

/** Returns the array of all registered users */
export function getUsers() {
  return JSON.parse(localStorage.getItem('mwa_users') || '[]');
}

/** Saves the full users array back to localStorage */
export function saveUsers(users) {
  localStorage.setItem('mwa_users', JSON.stringify(users));
}

/** Returns the user object if credentials match, otherwise null */
export function findUser(identifier, password) {
  const users = getUsers();
  return users.find(
    (u) =>
      (u.email === identifier || u.username === identifier) &&
      u.password === password
  ) || null;
}

/** Returns true if email is already taken */
export function emailExists(email) {
  return getUsers().some((u) => u.email === email);
}

/** Returns true if username is already taken */
export function usernameExists(username) {
  return getUsers().some((u) => u.username === username);
}

/** Registers a new user; returns the saved user object */
export function registerUser(userData) {
  const users = getUsers();
  const newUser = { ...userData, id: Date.now().toString() };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// ─── SESSION STORAGE ────────────────────────────────────────────────────────

/** Persists the logged-in user to localStorage */
export function setSession(user) {
  localStorage.setItem('mwa_session', JSON.stringify(user));
}

/** Returns the current session user or null */
export function getSession() {
  return JSON.parse(localStorage.getItem('mwa_session') || 'null');
}

/** Clears the session (logout) */
export function clearSession() {
  localStorage.removeItem('mwa_session');
}

// ─── MOVIE STORAGE ──────────────────────────────────────────────────────────

/** Key scoped to a specific user */
function movieKey(userId) {
  return `mwa_movies_${userId}`;
}

/** Returns the movie list for a given user */
export function getMovies(userId) {
  return JSON.parse(localStorage.getItem(movieKey(userId)) || '[]');
}

/** Saves the movie list for a given user */
export function saveMovies(userId, movies) {
  localStorage.setItem(movieKey(userId), JSON.stringify(movies));
}

/** Adds a new movie to a user's list */
export function addMovie(userId, movie) {
  const movies = getMovies(userId);
  const newMovie = { ...movie, id: Date.now().toString() };
  movies.push(newMovie);
  saveMovies(userId, movies);
  return newMovie;
}

/** Removes a movie by id */
export function removeMovie(userId, movieId) {
  const movies = getMovies(userId).filter((m) => m.id !== movieId);
  saveMovies(userId, movies);
}

/** Toggles the watched status of a movie */
export function toggleWatched(userId, movieId) {
  const movies = getMovies(userId).map((m) =>
    m.id === movieId ? { ...m, watched: !m.watched } : m
  );
  saveMovies(userId, movies);
}
