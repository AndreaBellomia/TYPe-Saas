"use client";
import * as React from "react";
import { SnackbarProvider } from "notistack";
import { useSnackbar } from "notistack";

import { SNACK_EVENT_NAME } from "@/libs/SnakClient";

export function SnackProvider(): null {
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    const handlerEvent = (event: any): void => {
      enqueueSnackbar(event.detail.message, {
        variant: event.detail.type,
        ...event.detail.options,
      });
    };

    document.addEventListener(SNACK_EVENT_NAME, handlerEvent);

    return () => {
      document.removeEventListener(SNACK_EVENT_NAME, handlerEvent);
    };
  }, []);
  return null;
}

export default function _({ children }: { children: React.ReactNode }) {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
}
