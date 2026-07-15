"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface PaymentContextType {
  selectedMethod: string | null;
  setSelectedMethod: (value: string | null) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  return (
    <PaymentContext.Provider value={{ selectedMethod, setSelectedMethod }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within PaymentProvider");
  return ctx;
}
