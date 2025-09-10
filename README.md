# Star Explorer 🌟

Um aplicativo React Native desenvolvido com Expo para explorar personagens do universo Star Wars. Este projeto utiliza a API SWAPI (Star Wars API) para buscar e exibir informações detalhadas sobre personagens, filmes e muito mais.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, mas recomendado)
- Para desenvolvimento mobile:
  - [Android Studio](https://developer.android.com/studio) (para Android)
  - [Xcode](https://developer.apple.com/xcode/) (para iOS - apenas macOS)
  - Ou o aplicativo [Expo Go](https://expo.dev/go) no seu dispositivo móvel

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd star-explorer
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento
```bash
npm start
# ou
npx expo start
```

## 📱 Executando o Aplicativo

Após iniciar o servidor de desenvolvimento, você verá um QR code no terminal. Você pode executar o app de várias formas:

### Opção 1: Expo Go (Mais Rápido)
1. Instale o [Expo Go](https://expo.dev/go) no seu dispositivo móvel
2. Escaneie o QR code com a câmera (iOS) ou com o próprio Expo Go (Android)

### Opção 2: Emuladores/Simuladores
```bash
# Para Android (requer Android Studio configurado)
npm run android

# Para iOS (requer Xcode - apenas macOS)
npm run ios

# Para Web
npm run web
```

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run android` - Executa no emulador Android
- `npm run ios` - Executa no simulador iOS
- `npm run web` - Executa no navegador web
- `npm run lint` - Executa o linter para verificar código
- `npm test` - Executa os testes unitários

## 🧪 Executando Testes

```bash
npm test
```

## 🏗️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset JavaScript com tipagem estática
- **Redux Toolkit** - Gerenciamento de estado
- **Axios** - Cliente HTTP para requisições à API
- **Tailwind CSS (twrnc)** - Estilização utilitária
- **Jest** - Framework de testes
- **React Navigation** - Navegação entre telas

## 📁 Estrutura do Projeto

```
app/
├── components/          # Componentes reutilizáveis
├── redux/              # Configuração Redux (store, slices)
├── screens/            # Telas da aplicação
├── services/           # Serviços de API
└── utils/              # Utilitários e helpers
```

## 🔧 Configuração de Desenvolvimento

O projeto está configurado com:
- **ESLint** para análise de código
- **TypeScript** para tipagem
- **Jest** para testes unitários
- **Expo Router** para navegação baseada em arquivos

## 📖 Funcionalidades

- 🔍 Busca de personagens Star Wars
- 📋 Lista de personagens com informações detalhadas
- 🎬 Visualização de filmes relacionados
- 📱 Interface responsiva e moderna
- ⭐ Animações e efeitos visuais