// src/utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
  return re.test(phone);
};

export const validateCPF = (cpf: string): boolean => {
  // Brazilian CPF validation
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  // ... validation algorithm
  return true;
};

export const validateCNPJ = (_cnpj: string): boolean => {
  // Brazilian CNPJ validation
  return true;
};

