"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ModeToggle } from "./ModeToggle";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={session?.user?.image || "https://github.com/shadcn.png"}
                alt="User's Avatar Image"
              />
              <AvatarFallback>
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <div>
              <p
                className="cursor-pointer hover:bg-slate-100 p-2 rounded"
                onClick={() => signOut()}
              >
                Sign out
              </p>
            </div>
          </PopoverContent>
        </Popover>
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
      <div className="flex gap-4">
        <AuthButton />
        <ModeToggle />
      </div>
    </nav>
  );
}
