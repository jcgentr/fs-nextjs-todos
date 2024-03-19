"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
    <main className="max-w-sm mx-auto">
      <h1 className="text-4xl">Todos</h1>
      <form
        onSubmit={addTodo}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Add new todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <Button type="submit" disabled={newTodoText.length === 0}>
          Add
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center ml-2 my-6"
          >
            {editingId === todo.id ? (
              <>
                <Input
                  type="text"
                  value={tempTitle}
                  ref={editInputRef}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tempTitle.length > 0) {
                      updateTodo({ ...todo, title: tempTitle });
                    }
                  }}
                  className="mr-2"
                />
                <div className="flex gap-2 self-end">
                  <Button
                    onClick={() => updateTodo({ ...todo, title: tempTitle })}
                    variant="secondary"
                    disabled={tempTitle.length === 0}
                  >
                    Save
                  </Button>
                  <Button onClick={cancelEditing} variant="outline">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() =>
                      updateTodo({ ...todo, completed: !todo.completed })
                    }
                  />
                  <span className={todo.completed ? "line-through" : ""}>
                    {todo.title}
                  </span>
                </div>
                <div className="flex gap-2 self-end">
                  <Button
                    onClick={() => startEditing(todo)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
