// src/components/PersonForm.tsx
import { useForm } from 'react-hook-form';
import { Person } from '../types';

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
      gender: 'M',
      email: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      nationality: '',
      naturalness: '',
      cpf: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Campo Gênero */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gênero*</label>
          <select
            {...register('gender', { required: 'Campo obrigatório' })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>

        {/* Campo CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700">CPF*</label>
          <input
            {...register('cpf', { 
              required: 'Campo obrigatório',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message: 'Formato inválido (XXX.XXX.XXX-XX)'
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
        </div>

        {/* Outros campos... (email, data nascimento, etc) */}
      </div>

      {/* Seção de Endereço */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-md font-medium mb-2">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Rua */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              {...register('address.street')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Outros campos de endereço... */}
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