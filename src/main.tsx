import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

createRoot(document.getElementById("root")!).render(
    <App />
);
