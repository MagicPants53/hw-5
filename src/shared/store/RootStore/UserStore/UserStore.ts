import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Meta } from "@/shared/utils/meta";
import {
  clearAuthData,
  clearAuthToken,
  getAuthData,
  getAuthToken,
  setAuthData,
  setAuthToken,
} from "@/shared/utils/auth";
import { User } from "@/shared/types/user";
import { apiUrls } from "@/shared/config/apiUrls";

type PrivateFields = "_user" | "_token" | "_meta" | "_errorMsg";

class UserStore {
  private _user: User | null = null;
  private _token: string | null = null;
  private _meta: Meta = Meta.initial;
  private _errorMsg: string | null = null;

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _user: observable,
      _token: observable,
      _meta: observable,
      _errorMsg: observable,

      user: computed,
      token: computed,
      meta: computed,
      isAuth: computed,

      login: action,
      register: action,
      logout: action,
    });

    const storedUser = getAuthData();
    const storedToken = typeof window !== "undefined" ? getAuthToken() : null;

    if (storedUser && storedToken) {
      runInAction(() => {
        this._user = storedUser;
        this._token = storedToken;
        this._meta = Meta.success;
      });
    }
  }

  get user() {
    return this._user;
  }
  get token() {
    return this._token;
  }
  get meta() {
    return this._meta;
  }
  get errorMsg() {
    return this._errorMsg;
  }
  get isAuth() {
    return !!this._user && !!this._token;
  }

  async login(email: string, password: string) {
    this._meta = Meta.loading;

    try {
      const response = await fetch(apiUrls.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      const result = await response.json();

      runInAction(() => {
        const { jwt, user } = result;
        this._token = jwt;
        this._user = user;
        this._meta = Meta.success;
        // сохраняем пользователя, а JWT кладем только в cookie
        setAuthData(user);
        setAuthToken(jwt);
      });
    } catch (error) {
      runInAction(() => {
        this._meta = Meta.error;
      });
    }
  }

  async register(username: string, email: string, password: string) {
    this._meta = Meta.loading;

    try {
      const response = await fetch(apiUrls.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const result = await response.json();
      runInAction(() => {
        const { jwt, user } = result;
        this._token = jwt;
        this._user = user;
        this._meta = Meta.success;
        // сохраняем пользователя, а JWT кладем только в cookie
        setAuthData(user);
        setAuthToken(jwt);
      });
    } catch (error) {
      runInAction(() => {
        this._meta = Meta.error;
      });
    }
  }

  async logout() {
    runInAction(() => {
      this._user = null;
      this._token = null;
      this._meta = Meta.initial;
      clearAuthData();
      clearAuthToken();
    });
  }
}

export default UserStore;
