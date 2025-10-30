import React, { StrictMode } from 'react' // Adicionando 'React' aqui para evitar o erro 'React is not defined'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx' 
// Import Test from './test.jsx' 

// O código de teste está aqui:
const TesteSimples = () => (
  <div style={{ backgroundColor: 'blue', padding: '30px', color: 'white', textAlign: 'center' }}>
    <h2>Test MAIN.JSX OK!</h2>
    <p>The React is working.</p>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Substituí <App /> pelo meu componente de teste simples */}
    <TesteSimples />
  </StrictMode>,
)