# 🐾 Sistema de Gestão Veterinária

Um sistema completo de gestão para clínicas veterinárias, desenvolvido com Laravel + React, proporcionando uma interface moderna e intuitiva para gerenciar clientes, animais, veterinários e consultas.

![Laravel](https://img.shields.io/badge/Laravel-12.28.1-red.svg)
![React](https://img.shields.io/badge/React-18.0+-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.3+-purple.svg)
![Node](https://img.shields.io/badge/Node.js-18.0+-green.svg)

## 📋 Índice

- [Sobre o Sistema](#-sobre-o-sistema)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Capturas de Tela](#-capturas-de-tela)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🏥 Sobre o Sistema

O Sistema de Gestão Veterinária é uma aplicação web completa projetada para automatizar e otimizar as operações de clínicas veterinárias. Oferece uma interface moderna e responsiva para gerenciar todos os aspectos do negócio, desde o cadastro de clientes até relatórios detalhados.

### 🎯 Objetivos

- **Eficiência**: Agilizar processos administrativos
- **Organização**: Centralizar informações de clientes e animais
- **Relatórios**: Gerar insights através de dashboards
- **Experiência**: Interface intuitiva e responsiva

## ✨ Funcionalidades

### 👥 Gestão de Clientes
- ✅ Cadastro completo de clientes (nome, email, telefone, CPF, endereço)
- ✅ Listagem e busca de clientes
- ✅ Edição e exclusão de registros
- ✅ Histórico de animais por cliente

### 🐕 Gestão de Animais
- ✅ Cadastro de pets (nome, espécie, raça, sexo, data nascimento)
- ✅ Vinculação com proprietários
- ✅ Controle de peso e observações
- ✅ Histórico de consultas

### 👨‍⚕️ Gestão de Veterinários
- ✅ Cadastro de profissionais (nome, CRMV, especialidade)
- ✅ Controle de contatos e informações
- ✅ Gestão de agenda e consultas

### 📅 Gestão de Consultas
- ✅ Agendamento de consultas
- ✅ Controle de status (agendada, realizada, cancelada)
- ✅ Histórico de procedimentos
- ✅ Relacionamento consulta-procedimento

### 📊 Relatórios e Dashboard
- ✅ Dashboard com estatísticas gerais
- ✅ Relatórios de clientes, animais e consultas
- ✅ Gráficos e indicadores de performance
- ✅ Dados em tempo real

### 🎨 Interface e UX
- ✅ Design responsivo (mobile-first)
- ✅ Tema escuro/claro
- ✅ Componentes reutilizáveis
- ✅ Feedback visual para ações

## 🛠 Tecnologias

### Backend
- **Laravel 12.28.1** - Framework PHP
- **MySQL/SQLite** - Banco de dados
- **Eloquent ORM** - Mapeamento objeto-relacional
- **Laravel Migrations** - Controle de versão do banco

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Gráficos e visualizações

### Ferramentas
- **Composer** - Gerenciador de dependências PHP
- **NPM** - Gerenciador de dependências JavaScript
- **Artisan** - CLI do Laravel
- **Hot Module Replacement** - Desenvolvimento em tempo real

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- **PHP 8.3+** com extensões: PDO, Mbstring, OpenSSL, Tokenizer, XML
- **Composer** (última versão)
- **Node.js 18+** e **NPM**
- **MySQL 8.0+** ou **SQLite 3**
- **Git** para controle de versão

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/TaviloBreno/clinica_veterinaria.git
cd clinica_veterinaria
```

### 2. Instale Dependências PHP
```bash
composer install
```

### 3. Instale Dependências JavaScript
```bash
npm install
```

### 4. Configure o Ambiente
```bash
# Copie o arquivo de configuração
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate
```

### 5. Configure o Banco de Dados
Edite o arquivo `.env` com suas configurações:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=veterinaria
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

Ou para SQLite (desenvolvimento):
```env
DB_CONNECTION=sqlite
DB_DATABASE=/caminho/para/database.sqlite
```

### 6. Execute as Migrações
```bash
# Criar e popular o banco de dados
php artisan migrate:fresh --seed
```

## ⚙️ Configuração

### Desenvolvimento

#### Iniciar Servidor Backend (Laravel)
```bash
php artisan serve
# Servidor rodando em: http://localhost:8000
```

#### Iniciar Servidor Frontend (React)
```bash
npm run dev
# Servidor rodando em: http://localhost:5174
```

### Produção

#### Build dos Assets
```bash
npm run build
```

#### Configurar Servidor Web
- Configure seu servidor web (Apache/Nginx) para servir a pasta `public/`
- Certifique-se de que o PHP e extensões estão instaladas
- Configure as permissões adequadas para `storage/` e `bootstrap/cache/`

## 💻 Uso

### Acessando o Sistema

1. **Desenvolvimento**: Acesse `http://localhost:5174`
2. **Produção**: Acesse seu domínio configurado

### Navegação Básica

1. **Dashboard**: Visão geral com estatísticas
2. **Clientes**: Gerenciar proprietários de animais
3. **Pets**: Gerenciar animais da clínica
4. **Veterinários**: Gerenciar equipe médica
5. **Consultas**: Agendar e controlar atendimentos
6. **Relatórios**: Análises e insights do negócio

### Fluxo de Trabalho Típico

1. **Cadastre clientes** com informações completas
2. **Registre animais** vinculados aos proprietários
3. **Cadastre veterinários** da sua equipe
4. **Agende consultas** entre veterinários e animais
5. **Visualize relatórios** para acompanhar o negócio

## 🌐 API Endpoints

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/{id}` - Buscar cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Excluir cliente

### Animais
- `GET /api/animals` - Listar animais
- `POST /api/animals` - Criar animal
- `GET /api/animals/{id}` - Buscar animal
- `PUT /api/animals/{id}` - Atualizar animal
- `DELETE /api/animals/{id}` - Excluir animal

### Veterinários
- `GET /api/veterinarios` - Listar veterinários
- `POST /api/veterinarios` - Criar veterinário
- `GET /api/veterinarios/{id}` - Buscar veterinário
- `PUT /api/veterinarios/{id}` - Atualizar veterinário
- `DELETE /api/veterinarios/{id}` - Excluir veterinário

### Consultas
- `GET /api/consultas` - Listar consultas
- `POST /api/consultas` - Criar consulta
- `GET /api/consultas/{id}` - Buscar consulta
- `PUT /api/consultas/{id}` - Atualizar consulta
- `DELETE /api/consultas/{id}` - Excluir consulta

### Relatórios
- `GET /api/reports` - Estatísticas gerais
- `GET /api/reports/clients` - Relatório de clientes
- `GET /api/reports/pets` - Relatório de animais
- `GET /api/reports/consultations` - Relatório de consultas

## 📁 Estrutura do Projeto

```
clinica_veterinaria/
├── app/
│   ├── Http/Controllers/     # Controllers da API
│   ├── Models/              # Models Eloquent
│   └── ...
├── database/
│   ├── migrations/          # Migrações do banco
│   ├── seeders/            # Seeds para popular dados
│   └── factories/          # Factories para testes
├── resources/
│   ├── js/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Context API
│   │   └── lib/          # Utilitários
│   └── css/
│       └── app.css       # Estilos Tailwind
├── routes/
│   ├── api.php           # Rotas da API
│   └── web.php           # Rotas web
├── public/               # Assets públicos
└── tests/               # Testes automatizados
```

### Principais Componentes

#### Models (Backend)
- `Cliente.php` - Proprietários de animais
- `Animal.php` - Pets da clínica
- `Veterinario.php` - Profissionais veterinários
- `Consulta.php` - Agendamentos e atendimentos
- `Procedure.php` - Procedimentos realizados

#### Pages (Frontend)
- `Dashboard.jsx` - Página principal
- `Home.jsx` - Dashboard com estatísticas
- `Cliente/` - Gestão de clientes
- `Pet/` - Gestão de animais
- `Veterinario/` - Gestão de veterinários
- `reports/` - Relatórios e análises

## 📸 Capturas de Tela

### Dashboard Principal
Interface limpa com estatísticas em tempo real e acesso rápido às funcionalidades.

### Gestão de Clientes
Formulários intuitivos para cadastro e edição de informações completas.

### Relatórios
Gráficos e indicadores para acompanhar a performance da clínica.

*Nota: Adicione capturas de tela reais do sistema em funcionamento*

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código

- **PHP**: Siga o PSR-12
- **JavaScript**: Use ESLint e Prettier
- **Commits**: Use Conventional Commits
- **Tests**: Mantenha cobertura de testes

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma **issue** com:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, PHP, Node versions)

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**Tavilo Breno**  
- GitHub: [@TaviloBreno](https://github.com/TaviloBreno)
- Email: [tavilo@email.com](mailto:tavilo@email.com)

---

<p align="center">
  Desenvolvido com ❤️ para facilitar a gestão de clínicas veterinárias
</p>

<p align="center">
  <strong>🐾 Cuidando de quem cuida dos nossos pets 🐾</strong>
</p>
