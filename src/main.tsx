import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeGA4 } from "./lib/analytics";

// QueryClient 인스턴스 생성 -> Tanstack Query 사용하기 위한 것
const queryClient = new QueryClient();
initializeGA4();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
