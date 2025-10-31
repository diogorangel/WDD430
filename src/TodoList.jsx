// CORREÇÃO: A sintaxe de importação foi corrigida e separada.
import React from "react" 
import { TodoItem } from "./TodoItem"

export function TodoList({ todos, toggleTodo, deleteTodo }) {
  return (
    <ul className="list">
      {/* Exibe "No Todos" se a lista estiver vazia */}
      {todos.length === 0 && "No Todos"}
      
      {/* Mapeia a lista de todos para renderizar os componentes TodoItem */}
      {todos.map(todo => {
        return (
          <TodoItem
            {...todo}
            key={todo.id}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        )
      })}
    </ul>
  )
}