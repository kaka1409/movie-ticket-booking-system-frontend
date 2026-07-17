"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useBooking } from "../context";

interface PaymentContextType {
  selectedMethod: string | null;
  setSelectedMethod: (value: string | null) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { setPaymentMethod } = useBooking();

  useEffect(() => {
    if (selectedMethod) {
      setPaymentMethod(selectedMethod);
    }
  }, [selectedMethod, setPaymentMethod]);

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
