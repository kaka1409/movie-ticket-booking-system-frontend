export interface AdminPaymentMethod {
  id: string;
  nameEn: string;
  nameVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  sortOrder: number;
  isActive: boolean;
  /** Gateway adapter is switched on in the backend env. */
  adapterEnabled: boolean;
}

export interface AdminPaymentMethodInput {
  nameEn?: string;
  nameVi?: string | null;
  descriptionEn?: string;
  descriptionVi?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
