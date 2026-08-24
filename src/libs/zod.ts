// import { z } from "zod";

export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 7;
}

export const PHONE_REGEX = /^\+?[\d\s\-().]{7,}$/;
export const PASSWORD_UPPERCASE = /[A-Z]/;
export const PASSWORD_NUMBER = /[0-9]/;
export const PASSWORD_SPECIAL = /[!@#$%^&*]/;
