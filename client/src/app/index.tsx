import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "../widgets";
import { BaseRouterProvider, MediaQueryContextProvider, QueryProvider, UiProvider } from "./providers";
export * from "./layout";
export * from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UiProvider>
    <ErrorBoundary>
      <React.StrictMode>
        <QueryProvider>
          <MediaQueryContextProvider>
            <BaseRouterProvider />
          </MediaQueryContextProvider>
        </QueryProvider>
      </React.StrictMode>
    </ErrorBoundary>
  </UiProvider>,
);
