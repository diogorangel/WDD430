import { useState } from 'react'
// import reactLogo from './assets/react.svg' // Mantive como comentário caso queira restaurar depois
// import viteLogo from '/vite.svg' // Mantive como comentário caso queira restaurar depois
import './App.css'

function App() {
  // const [count, setCount] = useState(0) // Comentei o estado, pois o código de teste é simples.

  // Retornando o código de teste simples e óbvio, conforme solicitado.
  return (
    <div style={{ backgroundColor: 'red', padding: '20px', color: 'white', textAlign: 'center' }}>
      <h1>PROJETO ESTÁ FUNCIONANDO!</h1>
      {/* O restante do seu código viria aqui (que antes eram os logos, botão de contagem, etc.) */}
      {/* Se quiser restaurar o conteúdo anterior, descomente o código abaixo: */}
      {/*
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
      */}
    </div>
  )
}

export default App