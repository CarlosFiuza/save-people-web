import type { ChangeEvent } from "react";
import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface CpfInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  error?: FieldError;
}

function CpfInput<T extends FieldValues>(props: CpfInputProps<T >) {
  const { register, error } = props;
  const formatCpf = (value: string): string => {
    // Remove tudo que não é dígito
    let formatted = value.replace(/\D/g, '');
    
    // Aplica a máscara: XXX.XXX.XXX-XX
    if (formatted.length > 3) {
      formatted = formatted.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (formatted.length > 6) {
      formatted = formatted.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (formatted.length > 9) {
      formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    // Limita a 14 caracteres (com a máscara)
    return formatted.substring(0, 14);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Formata o valor durante a digitação
    e.target.value = formatCpf(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        CPF*
      </label>
      <input
        {...register('cpf' as Path<T>, { 
          required: 'Campo obrigatório',
        })}
        onChange={handleChange}
        className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="000.000.000-00"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default CpfInput;
