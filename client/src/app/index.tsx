import React from "react";
import ReactDOM from "react-dom/client";
import { BaseRouterProvider, MediaQueryContextProvider, QueryProvider, UiProvider } from "./providers";
export * from "./layout";
export * from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <UiProvider>
        <MediaQueryContextProvider>
          <BaseRouterProvider />
        </MediaQueryContextProvider>
      </UiProvider>
    </QueryProvider>
  </React.StrictMode>,
);
