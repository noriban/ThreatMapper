const storagePrefix = 'deefence_';

export type AuthUserType = {
  isLogin: boolean;
  access_token: string;
  refresh_token: string;
};

const storage = {
  getAuth: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}auth`) as string);
  },
  setAuth: (token: AuthUserType) => {
    window.localStorage.setItem(`${storagePrefix}auth`, JSON.stringify(token));
  },
  clearAuth: () => {
    window.localStorage.removeItem(`${storagePrefix}auth`);
  },
};

export default storage;
