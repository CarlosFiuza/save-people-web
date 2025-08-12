// src/components/PersonForm.tsx
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Person } from '../../types';
import CpfInput from '../CpfInput';

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: Person) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PersonForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PersonFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Person>({
    defaultValues: initialData || {
      name: '',
      gender: undefined,
      email: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      nationality: '',
      naturalness: '',
      cpf: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome*</label>
          <input
            {...register('name', { required: 'Campo obrigatório' })}
            className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <CpfInput<Person> 
          register={register}
          error={errors.cpf}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            {...register('email', { 
              required: 'Campo obrigatório',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Formato inválido'
              }
            })}
            className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gênero</label>
          <select
            {...register('gender')}
            className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento*</label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Campo obrigatório' })}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-300 rounded-md shadow-sm py-2 px-3
              focus:outline-none focus:ring-blue-500 focus:border-blue-500
              bg-white text-gray-700"
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nacionalidade</label>
          <input
            {...register('nationality')}
            className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Naturalidade</label>
          <input
            {...register('naturalness')}
            className="mt-1 block text-gray-800 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Ações do Formulário */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};