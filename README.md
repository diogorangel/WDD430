WDD340 - Diogo Rangel Dos Santos @diogorangel 
React 
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Commands : 
npm create vite my-new-todo -- --template react
npm install react react-dom firebase
# Se o seu script se chama "start"
npm start

# Se o seu script se chama "dev" (comum em novos projetos Vite)
npm run dev

Se o problema persistir, é provável que você precise inicializar o projeto do zero usando o **Passo 2** com Vite ou `create-react-app`.
npm start
# ou
yarn dev
# ou
npm run dev

