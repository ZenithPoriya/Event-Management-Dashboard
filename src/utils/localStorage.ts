const STORAGE_KEY = "event_dashboard_auth";

type User = {
  email: string;
  password: string;
};

type AuthData = {
  currentUser: { email: string } | null;
  users: User[];
};

export function getAuthData(): AuthData {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial: AuthData = { currentUser: null, users: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

export function setAuthData(data: AuthData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function findUserByEmail(email: string): User | undefined {
  const data = getAuthData();
  console.log({data,email})
  return data.users.find((u) => u.email === email);
}

export function createUser(newUser: User): boolean {
  const data = getAuthData();
  const exists = findUserByEmail(newUser.email);
  if (exists) return false;

  data.users.push(newUser);
  setAuthData(data);
  return true;
}

export function authenticateUser(email: string, password: string): boolean {
  const user = findUserByEmail(email);
  return !!user && user.password === password;
}

export function loginUser(email: string) {
  const data = getAuthData();
  data.currentUser = { email };
  setAuthData(data);
}

export function logoutUser() {
  const data = getAuthData();
  data.currentUser = null;
  setAuthData(data);
}

export function getCurrentUser(): { email: string } | null {
  return getAuthData().currentUser;
}
