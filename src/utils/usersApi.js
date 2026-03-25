const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined. Please set it in your environment file.');
}

const USERS_ENDPOINT = `${API_URL}/users`;

async function parseJsonResponse(response) {
  if (!response.ok) {
    let message = 'Request failed. Please try again.';

    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') {
        message = data.message;
      }
    } catch {
      // Keep generic fallback message if response body is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function checkDuplicateUser(email, username) {
  const response = await fetch(USERS_ENDPOINT);
  const users = await parseJsonResponse(response);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const emailMatches = users.filter((u) => (u.email || '').toLowerCase() === normalizedEmail);
  const usernameMatches = users.filter((u) => (u.username || '').toLowerCase() === normalizedUsername);

  return {
    emailExists: emailMatches.length > 0,
    usernameExists: usernameMatches.length > 0,
  };
}

export async function createUser(userPayload) {
  const response = await fetch(USERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPayload),
  });

  return parseJsonResponse(response);
}

export async function findUserByCredentials(identifier, password) {
  const normalized = identifier.trim().toLowerCase();

  const response = await fetch(USERS_ENDPOINT);
  const users = await parseJsonResponse(response);

  return (
    users.find(
      (user) =>
        ((user.email || '').toLowerCase() === normalized ||
          (user.username || '').toLowerCase() === normalized) &&
        user.password === password
    ) || null
  );
}
