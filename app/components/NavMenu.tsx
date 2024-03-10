"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-4">
        <p>{session?.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="flex gap-4">
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}

export default function NavMenu() {
  return (
    <nav>
      <AuthButton />
    </nav>
  );
}
