"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/* ────────────────────────────────────────────────────────────
   LOGIN FORM CONTEXT
──────────────────────────────────────────────────────────── */

interface LoginFormContextType {
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  resetLoginForm: () => void;
}

const LoginFormContext = createContext<LoginFormContextType | null>(null);

export function LoginFormProvider({ children }: { children: ReactNode }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const resetLoginForm = useCallback(() => {
    setLoginEmail("");
    setLoginPassword("");
  }, []);

  const value = useMemo(
    () => ({
      loginEmail,
      setLoginEmail,
      loginPassword,
      setLoginPassword,
      resetLoginForm,
    }),
    [loginEmail, loginPassword, resetLoginForm],
  );

  return (
    <LoginFormContext.Provider value={value}>
      {children}
    </LoginFormContext.Provider>
  );
}

export function useLoginForm(): LoginFormContextType {
  const ctx = useContext(LoginFormContext);
  if (!ctx) throw new Error("useLoginForm must be used within LoginFormProvider");
  return ctx;
}

/* ────────────────────────────────────────────────────────────
   REGISTER FORM CONTEXT
──────────────────────────────────────────────────────────── */

interface RegisterFormContextType {
  registerName: string;
  setRegisterName: (value: string) => void;
  registerEmail: string;
  setRegisterEmail: (value: string) => void;
  registerPassword: string;
  setRegisterPassword: (value: string) => void;
  registerConfirmPassword: string;
  setRegisterConfirmPassword: (value: string) => void;
  registerTerms: boolean;
  setRegisterTerms: (value: boolean) => void;
  resetRegisterForm: () => void;
}

const RegisterFormContext = createContext<RegisterFormContextType | null>(null);

export function RegisterFormProvider({ children }: { children: ReactNode }) {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerTerms, setRegisterTerms] = useState(false);

  const resetRegisterForm = useCallback(() => {
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterTerms(false);
  }, []);

  const value = useMemo(
    () => ({
      registerName,
      setRegisterName,
      registerEmail,
      setRegisterEmail,
      registerPassword,
      setRegisterPassword,
      registerConfirmPassword,
      setRegisterConfirmPassword,
      registerTerms,
      setRegisterTerms,
      resetRegisterForm,
    }),
    [
      registerName,
      registerEmail,
      registerPassword,
      registerConfirmPassword,
      registerTerms,
      resetRegisterForm,
    ],
  );

  return (
    <RegisterFormContext.Provider value={value}>
      {children}
    </RegisterFormContext.Provider>
  );
}

export function useRegisterForm(): RegisterFormContextType {
  const ctx = useContext(RegisterFormContext);
  if (!ctx) throw new Error("useRegisterForm must be used within RegisterFormProvider");
  return ctx;
}
