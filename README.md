# Desafio para Seleção Node + React Stefanini
Este repositório contempla a solução frontend desenvolvida em React.
Link para a página ([https://carlosfiuza.github.io/](https://CarlosFiuza.github.io/save-people-web))

O desafio consiste em:
Criar uma aplicação para o cadastro de pessoas, composta por um back-end em
Node e um front-end em React. A aplicação deve seguir as especificações
abaixo:

## Back-end
Desenvolver uma API REST em Typescript + Nestjs que
permita as seguintes operações:
  1. Cadastro: Inserir novos registros de pessoas.
  2. Alteração: Atualizar informações de registros existentes.
  3. Remoção: Excluir registros de pessoas.
  4. Consulta: Buscar registros de pessoas.
  5. Informações a serem cadastradas:
  6. Nome: obrigatório
  7. Sexo: opcional
  8. E-mail: opcional, mas deve ser validado se preenchido
  9. Data de Nascimento: obrigatória, deve ser validada
  10. Naturalidade: opcional
  11. Nacionalidade: opcional
  12. CPF: obrigatório, deve ser validado (formato correto e unicidade)

Observação: As datas de cadastro e atualização dos dados devem ser armazenadas.

## Front-end
O front-end deve ser desenvolvido utilizando React 17 ou superior e deve
proporcionar uma interface amigável para o usuário realizar as operações
de cadastro, alteração, remoção e consulta.
