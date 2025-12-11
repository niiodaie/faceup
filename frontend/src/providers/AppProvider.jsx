import React from "react";
import { SessionProvider } from "../hooks/useSession.jsx";

export default function AppProvider({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
