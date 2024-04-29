import axios, { AxiosInstance } from "axios";
import { snack } from "@/libs/SnakClient"
import { AuthUtility } from "./auth";

type ParamsList = Array<{ param: string; value: string }>;
type GenericObject = { [key: string]: any };
type CallbackFunction = (response: any) => void;
type CallbackErrorFunction = (error: any) => void;
enum AxiosMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export const URLS: GenericObject = {
  API_SERVER: process.env.FRONTEND_API_URL,
};

export class FetchDispatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchDispatchError";
  }
}

export class Axios {
  protected axiosClient: AxiosInstance;

  constructor(headers = {}) {

    this.axiosClient = axios.create({
      headers: {
        ...headers,
      },
    });
  }

  setHeader(header: string, value: string): void {
    this.axiosClient.defaults.headers[header] = value;
  }

  private fetch(
    url: string,
    method: AxiosMethods,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ): void {
    this.axiosClient[method](url, { ...args })
      .then((response) => {
        callback(response);
      })
      .catch((reason) => {
        try {
          error(reason);
        } catch (e) {
          if (e instanceof FetchDispatchError) {
            snack.error(e.message)
          }

          console.error("Api fetch error: ", e);
        }
      });
  }

  get(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.GET, callback, error, args);
  }

  post(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.POST, callback, error, args);
  }

  put(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.PUT, callback, error, args);
  }

  patch(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.PATCH, callback, error, args);
  }

  delete(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.DELETE, callback, error, args);
  }

  public static buildURLparams(url: string, paramsList: ParamsList): string {
    let outputURL: string = url + "?";
    paramsList.forEach((elem, index) => {
      outputURL = outputURL.concat(`${elem.param}=${elem.value}`);
      if (index < paramsList.length - 1) {
        outputURL = outputURL.concat("&");
      }
    });

    return outputURL;
  }
}

export class DjangoApi extends Axios {
  constructor() {
    try {
      super({
        "Authorization" : `Token ${AuthUtility.getToken()}`
      });
  
      this.axiosClient.defaults.baseURL = URLS.API_SERVER;
      this.axiosClient.defaults.withCredentials = true;
    } catch (error) {
      console.log("DjangoAPI work only in client side", error);
    }
  }
}
