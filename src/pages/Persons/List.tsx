// src/pages/PersonsDashboard.tsx
import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Person {
  id: string;
  name: string;
  gender: 'M' | 'F' | 'O';
  email: string;
  dateOfBirth: string;
  nationality: string;
  naturalness: string;
  cpf: string;
  address: Address;
}

const initialPersonState = {
  name: '',
  gender: 'M' as const,
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
};

export default function PersonsDashboard() {
  const { isAuthenticated } = useAuth();
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newPerson, setNewPerson] = useState<Omit<Person, 'id'>>(initialPersonState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Person>({ ...initialPersonState, id: '' });

  // Carrega as pessoas
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPersons = async () => {
      try {
        const response = await api.get('v2/persons');
        setPersons(response.data);
      } catch (err) {
        setError('Erro ao carregar pessoas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersons();
  }, [isAuthenticated]);

  // Adiciona nova pessoa
  const handleAddPerson = async () => {
    try {
      const response = await api.post('v2/persons', newPerson);
      setPersons([...persons, response.data]);
      setNewPerson(initialPersonState);
      setIsAdding(false);
    } catch (err) {
      setError('Erro ao adicionar pessoa');
    }
  };

  // Remove pessoa
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) return;
    try {
      await api.delete(`v2/persons/${id}`);
      setPersons(persons.filter(person => person.id !== id));
    } catch (err) {
      setError('Erro ao remover pessoa');
    }
  };

  // Edição
  const startEditing = (person: Person) => {
    setEditingId(person.id);
    setEditData(person);
  };

  const cancelEditing = () => setEditingId(null);

  const saveEditing = async () => {
    try {
      const response = await api.put(`v2/persons/${editingId}`, editData);
      setPersons(persons.map(p => p.id === editingId ? response.data : p));
      setEditingId(null);
    } catch (err) {
      setError('Erro ao atualizar pessoa');
    }
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Pessoas</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar Pessoa
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

      {/* Formulário de Adição */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Nova Pessoa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome*</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.name}
                onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gênero*</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.gender}
                onChange={(e) => setNewPerson({...newPerson, gender: e.target.value as 'M' | 'F' | 'O'})}
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF*</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.cpf}
                onChange={(e) => setNewPerson({...newPerson, cpf: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.email}
                onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Nasc.*</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.dateOfBirth.split('T')[0]}
                onChange={(e) => setNewPerson({...newPerson, dateOfBirth: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nacionalidade</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.nationality}
                onChange={(e) => setNewPerson({...newPerson, nationality: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Naturalidade</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newPerson.naturalness}
                onChange={(e) => setNewPerson({...newPerson, naturalness: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-md font-medium mb-2">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rua</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newPerson.address.street}
                  onChange={(e) => setNewPerson({
                    ...newPerson,
                    address: {...newPerson.address, street: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newPerson.address.city}
                  onChange={(e) => setNewPerson({
                    ...newPerson,
                    address: {...newPerson.address, city: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newPerson.address.state}
                  onChange={(e) => setNewPerson({
                    ...newPerson,
                    address: {...newPerson.address, state: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newPerson.address.zipCode}
                  onChange={(e) => setNewPerson({
                    ...newPerson,
                    address: {...newPerson.address, zipCode: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPerson}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={!newPerson.name || !newPerson.cpf || !newPerson.dateOfBirth}
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Pessoas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nascimento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {persons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Nenhuma pessoa cadastrada
                </td>
              </tr>
            ) : (
              persons.map((person) => (
                <tr key={person.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.gender === 'M' ? 'Masculino' : person.gender === 'F' ? 'Feminino' : 'Outro'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.cpf}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.email || '-'}</div>
                    <div className="text-sm text-gray-500">{person.nationality || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(person.dateOfBirth).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{person.naturalness || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(person)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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

      {/* Modal de Edição */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Editar Pessoa</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Campos de edição (similar ao formulário de adição) */}
                {/* ... implemente os campos de edição aqui ... */}
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="text-md font-medium mb-2">Endereço</h3>
                {/* Campos de endereço para edição */}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditing}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}