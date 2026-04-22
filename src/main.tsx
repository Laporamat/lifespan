import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your own Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "167106095177-e6aj0t921uc3oqb39ijres78dg9ujjna.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
