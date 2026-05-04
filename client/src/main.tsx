import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "@/app/App";
import { AuthProvider } from "./app/Providers/AuthProvider";
import { SocketProvider } from "./app/Providers/SocketProvider";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
);
