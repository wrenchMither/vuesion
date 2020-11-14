import { Store } from 'vuex';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { IState } from '@/store/IState';
import { setupResponseInterceptor } from './setupResponseInterceptor';
import { setupRequestInterceptor } from './setupRequestInterceptor';

export interface IHttpService extends AxiosInstance {
  store?: Store<any>;
  redirect?: (path: string) => void;
  isReAuthenticating?: boolean;
  pendingRequests?: any[];
}

// eslint-disable-next-line import/no-mutable-exports
export let HttpService: IHttpService = axios.create();

export const initHttpService = (
  axiosInstance?: NuxtAxiosInstance,
  store?: Store<IState>,
  redirect?: (path: string) => void,
) => {
  if (axiosInstance && store?.state?.app?.config?.api?.baseUrl) {
    axiosInstance.setBaseURL(store.state.app.config.api.baseUrl);
    HttpService = (axiosInstance as unknown) as AxiosInstance;
  }

  HttpService.store = store;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  HttpService.redirect = redirect || function () {};
  HttpService.isReAuthenticating = false;
  HttpService.pendingRequests = [];

  setupRequestInterceptor();
  setupResponseInterceptor();
};

export const replaceOldToken = (request: AxiosRequestConfig, accessToken: string): AxiosRequestConfig => {
  request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
};
