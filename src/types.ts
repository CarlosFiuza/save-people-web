// src/types.ts
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Person {
  id?: string;
  name: string;
  gender: 'M' | 'F' | 'O';
  email: string;
  dateOfBirth: string;
  nationality: string;
  naturalness: string;
  cpf: string;
  address: Address;
}
