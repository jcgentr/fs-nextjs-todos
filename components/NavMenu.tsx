"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <p>{session?.user?.name}</p>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
  return (
    <div className="flex gap-4 items-center">
      <p>Not signed in</p>
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
}

export default function NavMenu() {
  return (
    <nav className="max-w-lg mx-auto flex items-center p-4 justify-between">
      <h1 className="text-4xl font-bold">Todos</h1>
      <AuthButton />
    </nav>
  );
}
