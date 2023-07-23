export interface User {
  id?: number;
  registrationNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  registrationDate?: string;
  lastLoginDate?: Date;
  password?: string;
  gender?: string;
  birthDate?: Date;
  city?: string;
  isActive?: boolean;
  deActivateReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roleId?: number;
}
