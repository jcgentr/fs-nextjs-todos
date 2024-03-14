"use client";

import type { Todo } from "@prisma/client";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Fetching todos failed: ", error);
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setTempTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempTitle("");
  };

  const addTodo = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodoText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTodo: Todo = await response.json();
      setTodos((currentTodos) => [...currentTodos, newTodo]);
    } catch (error) {
      console.error("Updating todo failed: ", error);
    }

    setNewTodoText("");
  };

  const updateTodo = async (selectedTodo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${selectedTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedTodo }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodo: Todo = await response.json();
      setTodos((currTodos) =>
        currTodos.map((todo) =>
          todo.id === selectedTodo.id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Updating todo failed: ", error);
    }

    cancelEditing();
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos((currTodos) => currTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Deleting todo failed: ", error);
    }
  };

  return (
    <main>
      <h1 className="text-4xl">Todos</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add new todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="border-2 border-lime-600 outline-lime-400"
        />
        <button type="submit" disabled={newTodoText.length === 0}>
          Add
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex gap-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodo({ ...todo, completed: !todo.completed })
              }
            />
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={tempTitle}
                  ref={editInputRef}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tempTitle.length > 0) {
                      updateTodo({ ...todo, title: tempTitle });
                    }
                  }}
                  className="border-2 border-lime-600 outline-lime-400"
                />
                <button
                  onClick={() => updateTodo({ ...todo, title: tempTitle })}
                  className="bg-blue-100"
                  disabled={tempTitle.length === 0}
                >
                  Save
                </button>
                <button onClick={cancelEditing} className="bg-yellow-100">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.title}
                </span>
                <button
                  onClick={() => startEditing(todo)}
                  className="bg-green-100"
                >
                  Edit
                </button>
              </>
            )}
            <button onClick={() => deleteTodo(todo.id)} className="bg-red-100">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
