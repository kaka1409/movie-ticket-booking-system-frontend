export interface AdminFoodItemInput {
  name?: string;
  nameVi?: string;
  category?: string;
  price?: number;
  image?: string | null;
  isActive?: boolean;
}

export interface AdminComboInput {
  name?: string;
  nameVi?: string | null;
  description?: string | null;
  descriptionVi?: string | null;
  price?: number;
  image?: string | null;
  tag?: string | null;
  isActive?: boolean;
}

export interface AdminFoodItem {
  id: string;
  name: string;
  nameVi?: string;
  category: string;
  price: number;
  image?: string;
  isActive: boolean;
  bookingCount: number;
}

export interface AdminCombo {
  id: string;
  name: string;
  nameVi?: string;
  description?: string;
  descriptionVi?: string;
  price: number;
  image?: string;
  tag?: string;
  isActive: boolean;
  bookingCount: number;
}
