import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Component for the first root (#app1)
const App1 = () => {
    // Retorna um componente de teste claramente distinto (Vermelho)
    return (
        <div style={{ 
            backgroundColor: '#ef4444', // Tailwind red-500
            padding: '30px', 
            color: 'white', 
            textAlign: 'center', 
            borderRadius: '12px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            margin: '20px auto'
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>APPLICATION 1 IS RUNNING!</h1>
            <p style={{ marginTop: '10px' }}>This component is mounted on **#app1**.</p>
        </div>
    );
}

// Component for the second root (#app2)
const App2 = () => {
    // Retorna um segundo componente de teste claramente distinto (Azul)
    return (
        <div style={{ 
            backgroundColor: '#3b82f6', // Tailwind blue-500
            padding: '30px', 
            color: 'white', 
            textAlign: 'center', 
            borderRadius: '12px', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            margin: '20px auto'
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>APPLICATION 2 IS RUNNING!</h1>
            <p style={{ marginTop: '10px' }}>This component is mounted on **#app2**.</p>
        </div>
    );
}

// --- Multi-Root Rendering ---

const rootElement1 = document.getElementById('app1');
const rootElement2 = document.getElementById('app2');

if (rootElement1) {
  createRoot(rootElement1).render(
    <StrictMode>
      <App1 />
    </StrictMode>
  );
}

if (rootElement2) {
  createRoot(rootElement2).render(
    <StrictMode>
      <App2 />
    </StrictMode>
  );
}

// Exporting App1 as the default for convenience
export default App1;
