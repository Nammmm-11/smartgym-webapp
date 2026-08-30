const KEYS = {
  TOKEN: 'fitmaster_token',
  USER: 'fitmaster_user',
};

export const storage = {
  setToken: (token: string) => localStorage.setItem(KEYS.TOKEN, token),
  getToken: () => localStorage.getItem(KEYS.TOKEN),
  setUser: (user: any) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  getUser: () => {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER);
  },
};