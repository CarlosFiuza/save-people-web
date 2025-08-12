// src/pages/v2/personsDashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { PersonModal } from '../components/PersonModal';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatAdress, mapGender, type Person } from '../types';
import Layout from '../components/Layout';
import { isAxiosError } from 'axios';
import useToast from '../hooks/useToast';

export default function PersonsDashboard() {
  const { isAuthenticated } = useAuth();
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const personNotFoudRegex = /^Person with ID(.)+not found/;
  const emailOrCpfDuplicated = /Person with cpf or email already exists!/;

  // Carrega as pessoas
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPersons = async () => {
      try {
        const response = await api.get('/v2/persons');
        console.log({ response });
        setPersons(response.data);
      } catch {
        toast.showError('Erro ao carregar pessoas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersons();
  }, [isAuthenticated]);

  // Adiciona/Edita pessoa
  const handleSavePerson = async (personData: Person) => {
    setIsSubmitting(true);
    try {
      if (currentPerson) {
        // Modo edição
        const response = await api.put(`/v2/persons/${currentPerson.id}`, personData);
        setPersons(persons.map(p => p.id === currentPerson.id ? response.data : p));
      } else {
        // Modo adição
        const response = await api.post('/v2/persons', personData);
        setPersons([...persons, response.data]);
      }
      setIsModalOpen(false);
      toast.showSuccess('Pessoa cadastrada com sucesso!');
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.message, emailOrCpfDuplicated.test(err.response.data.message))

        if (personNotFoudRegex.test(err.response.data.message)) {
          toast.showWarning('Pessoa não encontrada!')
        } else if (emailOrCpfDuplicated.test(err.response.data.message)) {
          toast.showWarning('Pessoa com esse email ou cpf já cadastrada!')
        }
      } else {
        toast.showError('Erro ao salvar pessoa');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove pessoa
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) return;
    try {
      await api.delete(`/v2/persons/${id}`);
      setPersons(persons.filter(person => person.id !== id));
    } catch {
      toast.showError('Erro ao remover pessoa');
    }
  };

  // Abre modal para edição
  const handleEdit = (person: Person) => {
    setCurrentPerson(person);
    setIsModalOpen(true);
  };

  // Abre modal para adição
  const handleAdd = () => {
    setCurrentPerson(null);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return <div className="p-4 text-red-500">Faça login para acessar</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard de Pessoas</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Pessoa
          </button>
        </div>

        {/* Tabela de Pessoas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Cabeçalho da tabela */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gênero</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dt. Nascimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacionalidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naturalidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            
            {/* Corpo da tabela */}
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma pessoa cadastrada
                  </td>
                </tr>
              ) : (
                persons.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.cpf}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mapGender[person.gender]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.dateOfBirth}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.nationality}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.naturalness || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatAdress(person.address) || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(person)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(person.id!)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal para adicionar/editar pessoa */}
        <PersonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePerson}
          initialData={currentPerson || undefined}
          isLoading={isSubmitting}
        />
      </div>
    </Layout>
  );
}