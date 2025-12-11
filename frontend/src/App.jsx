import React from "react";
import AppProvider from "./providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";
import GoogleAnalytics from "./components/GoogleAnalytics";

export default function App() {
  return (
    <AppProvider>
      <GoogleAnalytics />
      <AppRoutes />
    </AppProvider>
  );
}
