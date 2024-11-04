// Simple authentication logic
const credentials = {
  username: 'admin',
  password: 'password123',
};

export const loginUser = (username, password) => {
  if (username === credentials.username && password === credentials.password) {
    return true; // Login success
  }
  return false; // Login failure
};
