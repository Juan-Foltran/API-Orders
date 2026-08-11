# Orders 📝

Uma API construída com **Node.js**, **Express**, **TypeScript**, **Prisma** e **PostgreSQL** para gerenciar usuários, solicitações de lojas, produtos e aprovações administrativas.

## 📌 Sobre o Projeto

Este projeto é uma API desenvolvida para controlar o cadastro de usuários, autenticação, solicitação de criação de lojas e gerenciamento de produtos por vendedores. Usuários podem solicitar a criação de uma loja, administradores podem aprovar ou rejeitar essas solicitações e vendedores podem cadastrar, listar e deletar produtos das suas próprias lojas.

## 🛠️ Tecnologias e Ferramentas Utilizadas

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Jest](https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🚀 Como Executar

### 1️⃣ Instalação e Preparação

Navegue até a pasta do projeto e instale as dependências necessárias:

```bash
npm install
```

### 2️⃣ Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar o banco de dados, Docker e autenticação JWT.

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco"

POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=nome_do_banco
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=10m
COOKIE_EXPIRE_IN=10m
```

### 3️⃣ Banco de Dados

O projeto utiliza o banco de dados PostgreSQL. Você pode subir o banco de dados usando o Docker com o comando:

```bash
docker-compose up -d
```

Depois de configurar o banco, execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Caso seja necessário gerar o client do Prisma, use:

```bash
npx prisma generate
```

### 4️⃣ Rodando a Aplicação

Você pode executar o projeto em modo de desenvolvimento com o comando:

```bash
npm run dev
```

A API será iniciada na porta `3333`.

## 🎯 Scripts Disponíveis

- `npm run dev`: Inicia o servidor com monitoramento de alterações.
- `npm test`: Executa os testes com Jest e gera relatório de cobertura.
- `npm run commit`: Inicia o Commitizen para criar commits seguindo o padrão configurado.

## 📍 Endpoints da API

| Método   | Rota                       | Descrição                                                                                                          |
| :------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/user/create`             | Cria um novo usuário. [Detalhes](#post-createuser)                                                                 |
| `POST`   | `/login`                   | Realiza login e salva o token JWT em cookie. [Detalhes](#post-login)                                               |
| `GET`    | `/stores`                  | Lista as lojas cadastradas para o usuário autenticado. [Detalhes](#get-stores)                                     |
| `POST`   | `/requestStore`            | Cria uma solicitação de loja para o usuário autenticado. [Detalhes](#post-requeststore)                            |
| `GET`    | `/requestStore/me`         | Lista as solicitações de loja do usuário autenticado. [Detalhes](#get-requeststoreme)                              |
| `POST`   | `/product/create/:storeId` | Cria um produto em uma loja do vendedor autenticado. [Detalhes](#post-productcreatestoreid)                        |
| `DELETE` | `/product/delete/:storeId` | Deleta um produto de uma loja do vendedor autenticado. [Detalhes](#delete-productdeletestoreid)                    |
| `GET`    | `/product/list/:storeId`   | Lista os produtos de uma loja do vendedor autenticado. [Detalhes](#get-productliststoreid)                         |
| `PATCH`  | `/product/update/:storeId` | Atualiza um produto de uma loja do vendedor autenticado. [Detalhes](#patch-productupdatestoreid)                   |
| `GET`    | `/requests`                | Lista todas as solicitações de lojas. Rota exclusiva para administradores. [Detalhes](#get-requests)               |
| `POST`   | `/requests/update`         | Atualiza o status de uma solicitação de loja. Rota exclusiva para administradores. [Detalhes](#post-updaterequest) |

<h3 id="post-createuser">/user/create</h3>

#### Corpo da Requisição

```json
{
  "userName": "Juan",
  "email": "juan@email.com",
  "password": "Test123#",
  "userAddress": "Rua Exemplo, numero 123"
}
```

#### Possíveis Respostas:

- **201 Created**: Usuário criado com sucesso.
- **400 Bad Request**: Dados inválidos ou email já cadastrado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="post-login">/login</h3>

#### Corpo da Requisição

```json
{
  "email": "juan@email.com",
  "password": "Test123#"
}
```

#### Possíveis Respostas:

- **200 OK**: Login realizado com sucesso e token salvo no cookie `token`.
- **400 Bad Request**: Email ou senha não enviados.
- **401 Unauthorized**: Email ou senha inválidos.
- **500 Server Error**: Erro interno no servidor.

<h3 id="get-stores">/stores</h3>

#### Descrição

Lista as lojas disponíveis. Esta rota exige que o usuário esteja autenticado.

#### Exemplo de Resposta

```json
[
  {
    "idStore": 1,
    "nameStore": "Minha Loja",
    "category": "Lanches",
    "storeAddress": "Rua da Loja, numero 456"
  }
]
```

#### Possíveis Respostas:

- **200 OK**: Lista de lojas retornada com sucesso.
- **401 Unauthorized**: Usuário não autenticado ou token inválido.
- **500 Server Error**: Erro interno no servidor.

<h3 id="post-requeststore">/requestStore</h3>

#### Descrição

Cria uma solicitação para abrir uma loja. Esta rota exige que o usuário esteja autenticado.

#### Corpo da Requisição

```json
{
  "nameStore": "Minha Loja",
  "contactEmail": "contato@minhaloja.com",
  "cnpj": "12345678000199",
  "storeAddress": "Rua da Loja, numero 456",
  "category": "Lanches"
}
```

#### Possíveis Respostas:

- **201 Created**: Solicitação criada com sucesso.
- **400 Bad Request**: Dados inválidos, CNPJ já solicitado ou CNPJ já cadastrado em uma loja.
- **401 Unauthorized**: Usuário não autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="get-requeststoreme">/requestStore/me</h3>

#### Descrição

Lista as solicitações de loja criadas pelo usuário autenticado.

#### Possíveis Respostas:

- **200 OK**: Lista de solicitações retornada com sucesso.
- **401 Unauthorized**: Usuário não autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="post-productcreatestoreid">/product/create/:storeId</h3>

#### Descrição

Cria um produto em uma loja pertencente ao vendedor autenticado. Esta rota exige que o usuário tenha a role `OWNER`.

Exemplo: `http://localhost:3333/product/create/1`.

#### Corpo da Requisição

```json
{
  "title": "Produto Exemplo",
  "description": "Descrição do produto exemplo",
  "price": 19.9
}
```

#### Possíveis Respostas:

- **201 Created**: Produto criado com sucesso.
- **400 Bad Request**: Dados inválidos ou falha ao criar produto.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é vendedor ou a loja não pertence ao usuário autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="delete-productdeletestoreid">/product/delete/:storeId</h3>

#### Descrição

Deleta um produto de uma loja pertencente ao vendedor autenticado. Esta rota exige que o usuário tenha a role `OWNER`.

Exemplo: `http://localhost:3333/product/delete/1`.

#### Corpo da Requisição

```json
{
  "productId": 1
}
```

#### Possíveis Respostas:

- **200 OK**: Produto deletado com sucesso.
- **400 Bad Request**: Dados inválidos ou produto inexistente.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é vendedor ou a loja não pertence ao usuário autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="get-productliststoreid">/product/list/:storeId</h3>

#### Descrição

Lista os produtos de uma loja pertencente ao vendedor autenticado. Exemplo: `http://localhost:3333/product/list/1`.

#### Possíveis Respostas:

- **200 OK**: Lista de produtos retornada com sucesso.
- **400 Bad Request**: ID da loja inválido.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é vendedor ou a loja não pertence ao usuário autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="patch-productupdatestoreid">/product/update/:storeId</h3>

#### Descrição

Atualiza um produto de uma loja pertencente ao vendedor autenticado. Esta rota exige que o usuário tenha a role `OWNER`.

Exemplo: `http://localhost:3333/product/update/1`.

#### Corpo da Requisição

```json
{
  "productId": 1,
  "title": "Produto Atualizado",
  "description": "Descrição atualizada do produto",
  "price": 29.9
}
```

O campo `productId` é obrigatório. Pelo menos um dos campos abaixo deve ser enviado para atualização:

- `title`
- `description`
- `price`

#### Possíveis Respostas:

- **200 OK**: Produto atualizado com sucesso.
- **400 Bad Request**: Dados inválidos, produto inexistente ou falha ao atualizar produto.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é vendedor ou a loja não pertence ao usuário autenticado.
- **500 Server Error**: Erro interno no servidor.

<h3 id="get-requests">/requests</h3>

#### Descrição

Lista todas as solicitações de criação de lojas. Esta rota exige que o usuário tenha a role `ADMIN`.

#### Possíveis Respostas:

- **200 OK**: Lista de solicitações retornada com sucesso.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é administrador.
- **500 Server Error**: Erro interno no servidor.

<h3 id="post-updaterequest">/requests/update</h3>

#### Descrição

Atualiza o status de uma solicitação de loja. Ao aprovar uma solicitação, a API cria a loja e transforma o usuário em `OWNER` caso ele ainda seja `USER`.

#### Corpo da Requisição

```json
{
  "idStore": 1,
  "status": "APPROVED"
}
```

O campo `status` aceita os valores:

- `APPROVED`
- `REJECTED`
- `PENDING`

#### Possíveis Respostas:

- **201 Created**: Solicitação aprovada e loja criada com sucesso.
- **200 OK**: Solicitação rejeitada ou mantida como pendente.
- **400 Bad Request**: Dados inválidos.
- **401 Unauthorized**: Usuário não autenticado.
- **403 Forbidden**: Usuário não é administrador.
- **404 Not Found**: Solicitação não encontrada.
- **409 Conflict**: Solicitação já processada.
- **500 Server Error**: Erro ao processar a solicitação.

## 📄 Fins do projeto

> **Aviso:** Este projeto foi desenvolvido para fins de estudo e aprendizado de tecnologias como Node.js, Typescript, Express, Prisma, Docker, PostgreSQL, autenticação JWT e testes automatizados.

---

Em desenvolvimento por [Juan Foltran](https://github.com/Juan-Foltran) 🚀
