import axios, { AxiosInstance } from "axios";


type ParamsList = Array<{ param: string; value: string }>;
type GenericObject = {[key:string] : string}
type CallbackFunction = (response: any) => void;
type CallbackErrorFunction = (error: any) => void;


export const URLS: GenericObject = {
    API_SERVER : "http://localhost:8000"
}

export class FetchDispatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchDispatchError";
  }
}

enum AxiosMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}


export class Axios {
  protected axiosClient: AxiosInstance;

  constructor(
    private token: string | null = null,
    public tokenType: string = "Token",
  ) {
    const headers: { [key: string]: string } = {};

    if (typeof token === "string") {
      headers.Authorization = tokenType + " " + token;
    }

    this.axiosClient = axios.create({
      headers: {
        ...headers,
      },
    });
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
            console.error("Tooltip to user");
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

  async post(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.POST, callback, error, args);
  }

  async put(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.PUT, callback, error, args);
  }

  async patch(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.PATCH, callback, error, args);
  }

  async delete(
    url: string,
    callback: CallbackFunction,
    error: CallbackFunction,
    args: GenericObject = {},
  ) {
    this.fetch(url, AxiosMethods.DELETE, callback, error, args);
  }

  static buildURLparams(url: string, paramsList: ParamsList): string {
    let outputURL: string = url + "?";
    paramsList.forEach((elem, index) => {
      outputURL.concat(`${elem.param}=${elem.value}`);
      if (index < paramsList.length - 1) {
        outputURL.concat("&");
      }
    });

    return outputURL;
  }
}
