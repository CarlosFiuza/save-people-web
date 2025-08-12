// src/components/PersonModal.tsx
import { Fragment } from 'react';
import type { PersonV2 } from '../../types';
import { Dialog, Transition } from '@headlessui/react';
import { PersonFormV2 } from './PersonFormV2';

interface PersonModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PersonV2) => void;
  initialData?: PersonV2;
  isLoading?: boolean;
}

export const PersonModalV2 = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isLoading 
}: PersonModalV2Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {initialData ? 'Editar Pessoa' : 'Adicionar Pessoa'}
                </Dialog.Title>
                
                <div className="mt-4">
                  <PersonFormV2
                    initialData={initialData}
                    onSubmit={onSave}
                    onCancel={onClose}
                    isLoading={isLoading}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};