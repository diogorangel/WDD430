// 1. CORREÇÃO PRINCIPAL: Importação do React para resolver "React is not defined"
import React from "react" 

export function TodoItem({ completed, id, title, toggleTodo, deleteTodo }) {
  
  // 2. CORREÇÃO ADICIONAL: Checagem de segurança para dados inválidos (null/undefined)
  if (!id || title === undefined) {
    // Se o item não tiver um ID ou Título válido (possível dado corrompido do localStorage),
    // retorne null para não renderizar e evitar o erro.
    return null; 
  }

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={e => toggleTodo(id, e.target.checked)}
        />
        {title}
      </label>
      <button onClick={() => deleteTodo(id)} className="btn btn-danger">
        Delete
      </button>
    </li>
  )
}