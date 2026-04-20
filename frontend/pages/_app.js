import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  // Fix SSR theme flash
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}
