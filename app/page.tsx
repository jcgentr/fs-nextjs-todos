"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

const fakeTodos: Todo[] = [
  { id: 1, title: "Buy groceries", isCompleted: false },
  { id: 2, title: "Read a book", isCompleted: false },
  { id: 3, title: "Write a blog post", isCompleted: true },
  { id: 4, title: "Work out", isCompleted: false },
  { id: 5, title: "Call mom", isCompleted: true },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(fakeTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

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

  const saveTodo = (id: number) => {
    setTodos((currTodos) =>
      currTodos.map((todo) =>
        todo.id === id ? { ...todo, title: tempTitle } : todo
      )
    );
    cancelEditing();
  };

  const addTodo = (event: FormEvent) => {
    event.preventDefault();
    const newId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
    setTodos([...todos, { id: newId, title: newTodoText, isCompleted: false }]);
    setNewTodoText("");
  };

  const updateTodo = (id: number) => {
    setTodos((currTodos) =>
      currTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((currTodos) => currTodos.filter((todo) => todo.id !== id));
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
              checked={todo.isCompleted}
              onChange={() => updateTodo(todo.id)}
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
                      saveTodo(todo.id);
                    }
                  }}
                  className="border-2 border-lime-600 outline-lime-400"
                />
                <button
                  onClick={() => saveTodo(todo.id)}
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
                <span className={todo.isCompleted ? "line-through" : ""}>
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
