export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export type Gender = 'M' | 'F' | 'O';

export const mapGender: Record<Gender, string> = {
  'M': 'Masculino',
  'F': 'Feminino',
  'O': 'Outro',
};

export const formatAdress = (address?: Address) => {
  if (!address) return '-'
  
  return `${address.street} - ${address.city} - ${address.state} - ${address.zipCode}`
}

export interface Person {
  id?: number;
  name: string;
  gender: Gender;
  email: string;
  dateOfBirth: string;
  nationality: string;
  naturalness: string;
  cpf: string;
}

export interface PersonV2 extends Person {
  address: Address;
}

export const USER_KEY = 'user';
export const TOKEN_KEY = 'token';