import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, MagnifyingGlassIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { isAxiosError } from 'axios';
import { formatAdress, mapGender, type PersonV2 } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import api from '../../services/api';
import Layout from '../../components/Layout';
import { PersonModalV2 } from '../../components/v2/PersonModalV2';

export default function PersonsDashboardV2() {
  const { isAuthenticated } = useAuth();
  const [persons, setPersons] = useState<PersonV2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<PersonV2 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Estados para paginação e busca
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const personNotFoudRegex = /^Person with ID(.)+not found/;
  const emailOrCpfDuplicated = /Person with cpf or email already exists!/;

  // Função para buscar pessoas com paginação e filtro
  const fetchPersons = async (page = 1, name = '') => {
    try {
      setIsLoading(true);
      const response = await api.get('/v2/persons', {
        params: {
          page,
          itemsPerPage,
          personName: name
        },
      });
      
      setPersons(response.data.persons);
      setTotalItems(response.data.pagination.totalItems || 0);
      setTotalPages(Math.ceil(response.data.pagination.totalItems / response.data.pagination.itemsPerPage));
    } catch (error) {
      toast.showError('Erro ao carregar pessoas');
      console.error('Error fetching persons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega as pessoas ao montar o componente ou quando a página muda
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPersons(currentPage, searchTerm);
  }, [isAuthenticated, currentPage]);

  // Busca com debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce para evitar múltiplas requisições
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      setCurrentPage(1); // Resetar para a primeira página ao buscar
      fetchPersons(1, value);
    }, 500));
  };

  // Adiciona/Edita pessoa
  const handleSavePerson = async <T,>(personData: T) => {
    setIsSubmitting(true);
    try {
      if (currentPerson) {
        // Modo edição
        await api.put(`/v2/persons/${currentPerson.id}`, personData);
      } else {
        // Modo adição
        await api.post('/v2/persons', personData);
      }
      
      // Recarregar os dados mantendo a página e filtro atuais
      fetchPersons(currentPage, searchTerm);
      setIsModalOpen(false);
      toast.showSuccess('Pessoa cadastrada com sucesso!');
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        if (personNotFoudRegex.test(err.response.data.message)) {
          toast.showWarning('Pessoa não encontrada!');
        } else if (emailOrCpfDuplicated.test(err.response.data.message)) {
          toast.showWarning('Pessoa com esse email ou cpf já cadastrada!');
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
      // Recarregar os dados mantendo a página e filtro atuais
      fetchPersons(currentPage, searchTerm);
      toast.showSuccess('Pessoa excluída com sucesso!');
    } catch {
      toast.showError('Erro ao remover pessoa');
    }
  };

  // Abre modal para edição
  const handleEdit = (person: PersonV2) => {
    setCurrentPerson(person);
    setIsModalOpen(true);
  };

  // Abre modal para adição
  const handleAdd = () => {
    setCurrentPerson(null);
    setIsModalOpen(true);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };


  if (!isAuthenticated) {
    return <div className="p-4 text-red-500">Faça login para acessar</div>;
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

        {/* Barra de Busca */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 text-gray-900 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : persons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma pessoa encontrada
                  </td>
                </tr>
              ) : (
                persons.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
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

        {/* Paginação */}
        <div className={`flex items-center justify-between mt-6`}>
          <div className="text-sm">
            Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <PersonModalV2
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