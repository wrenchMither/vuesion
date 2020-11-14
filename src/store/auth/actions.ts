/**
 * based on Springboot security
 */

import { ActionContext } from 'vuex';
import { IState } from '@/store/IState';
import { HttpService } from '@/plugins/http-service/HttpService';
import { IAuthState } from './state';

export interface IAuthResponse {
  access_token: string; // eslint-disable-line
  refresh_token: string; // eslint-disable-line
}

export interface IAuthRequest {
  username: string;
  password: string;
}

export interface IAuthActions {
  createToken(context: ActionContext<IAuthState, IState>, data: IAuthRequest): Promise<any>;

  refreshToken(context: ActionContext<IAuthState, IState>): Promise<any>;

  revokeToken(context: ActionContext<IAuthState, IState>): Promise<any>;
}

const getFormData = (username: string, password: string) =>
  `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

export const AuthActions: IAuthActions = {
  async createToken({ commit }, { username, password }) {
    try {
      const {
        data: { access_token, refresh_token }, // eslint-disable-line
      } = await HttpService.post<IAuthResponse>('/token', getFormData(username, password), {
        headers: {
          Authorization: 'Basic Zm9vYmFy',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      commit('SET_ACCESS_TOKEN', access_token);
      commit('SET_REFRESH_TOKEN', refresh_token);
    } catch (e) {
      commit('SET_ACCESS_TOKEN', null);
      commit('SET_REFRESH_TOKEN', null);
      throw new Error(e);
    }
  },
  async refreshToken({ commit, state: { refreshToken } }) {
    try {
      const {
        data: { access_token, refresh_token }, // eslint-disable-line
      } = await HttpService.post<IAuthResponse>('/token', `grant_type=refresh_token&refresh_token=${refreshToken}`, {
        headers: {
          Authorization: 'Basic Zm9vYmFy',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      commit('SET_ACCESS_TOKEN', access_token);
      commit('SET_REFRESH_TOKEN', refresh_token);
    } catch (e) {
      commit('SET_ACCESS_TOKEN', null);
      commit('SET_REFRESH_TOKEN', null);
      throw new Error(e);
    }
  },
  async revokeToken({ commit }) {
    try {
      await HttpService.delete('/token');

      commit('SET_ACCESS_TOKEN', null);
      commit('SET_REFRESH_TOKEN', null);
    } catch (e) {
      commit('SET_ACCESS_TOKEN', null);
      commit('SET_REFRESH_TOKEN', null);
    }
  },
};

export default AuthActions;
