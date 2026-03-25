const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined. Please set it in your environment file.');
}

const USERS_ENDPOINT = `${API_BASE_URL}/users`;

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
  const [emailUsers, usernameUsers] = await Promise.all([
    fetch(`${USERS_ENDPOINT}?email=${encodeURIComponent(email)}`),
    fetch(`${USERS_ENDPOINT}?username=${encodeURIComponent(username)}`),
  ]);

  const emailMatches = await parseJsonResponse(emailUsers);
  const usernameMatches = await parseJsonResponse(usernameUsers);

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

  const [emailResponse, usernameResponse] = await Promise.all([
    fetch(`${USERS_ENDPOINT}?email=${encodeURIComponent(normalized)}&password=${encodeURIComponent(password)}`),
    fetch(`${USERS_ENDPOINT}?username=${encodeURIComponent(normalized)}&password=${encodeURIComponent(password)}`),
  ]);

  const emailMatches = await parseJsonResponse(emailResponse);
  const usernameMatches = await parseJsonResponse(usernameResponse);

  return emailMatches[0] || usernameMatches[0] || null;
}
