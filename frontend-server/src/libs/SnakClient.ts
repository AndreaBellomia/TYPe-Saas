enum DetailType {
  ERROR = "error",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  REGULAR = "",
}

type GenericObject = { [key: string]: any };
interface DetailObject {
  message: string;
  type: DetailType;
  options: GenericObject;
}

export class Snack {
  options: GenericObject;
  constructor(options: GenericObject = {}) {
    this.options = {
      autoHideDuration: 3000,
      ...options,
    };
  }

  triggerEvent(detail: DetailObject) {
    const event = new CustomEvent(SNACK_EVENT_NAME, { detail });

    if (!event.detail) {
      console.error("Event detail not specified");
      return;
    }

    document.dispatchEvent(event);
  }

  error(message: string) {
    const detail: DetailObject = {
      message: message,
      type: DetailType.ERROR,
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  success(message: string) {
    const detail: DetailObject = {
      message: message,
      type: DetailType.SUCCESS,
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  warning(message: string) {
    const detail: DetailObject = {
      message: message,
      type: DetailType.WARNING,
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  info(message: string) {
    const detail: DetailObject = {
      message: message,
      type: DetailType.INFO,
      options: this.options,
    };

    this.triggerEvent(detail);
  }

  regular(message: string) {
    const detail: DetailObject = {
      message: message,
      type: DetailType.REGULAR,
      options: this.options,
    };

    this.triggerEvent(detail);
  }
}

export const snack: Snack = new Snack();

export const SNACK_EVENT_NAME: string = "dispatchSnack";
