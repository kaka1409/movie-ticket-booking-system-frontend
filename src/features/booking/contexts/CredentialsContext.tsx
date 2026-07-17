"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CredentialsContextType {
  isValid: boolean;
  setIsValid: (value: boolean) => void;
}

const CredentialsContext = createContext<CredentialsContextType | null>(null);

export function CredentialsProvider({ children }: { children: ReactNode }) {
  const [isValid, setIsValid] = useState(false);
  return (
    <CredentialsContext.Provider value={{ isValid, setIsValid }}>
      {children}
    </CredentialsContext.Provider>
  );
}

export function useCredentials() {
  const ctx = useContext(CredentialsContext);
  if (!ctx) throw new Error("useCredentials must be used within CredentialsProvider");
  return ctx;
}
