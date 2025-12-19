export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  alternativePhone?: string;
  role: string;
  status: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}
