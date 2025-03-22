"use client";

import { WordItem } from "../components/words";
import { useQuery } from "@tanstack/react-query";
import { AddWordModal } from "../components/add-word-modal";
import { Word } from "../lib/db/schema";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Words: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: words, isLoading } = useQuery({
    queryKey: ["words"],
    queryFn: async (): Promise<Word[]> => {
      const response = await fetch("/api/words");
      return await response.json();
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wordbook</h1>
        <div className="flex gap-2">
          <SignedOut>
            <Button
              variant="outline"
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
              asChild
            >
              <SignInButton />
            </Button>
            <Button asChild>
              <SignUpButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <AddWordModal />
            <div className="mx-2 flex items-center">
              <UserButton />
            </div>
          </SignedIn>
          {mounted && (
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
          )}
        </div>
      </header>
      <SignedOut>
        <div className="text-center py-12 space-y-4">
          <h2 className="text-2xl font-bold">Your Personal Dictionary</h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Create your own collection of words.
            <br />
            Start improving your vocabulary in a simple and organized way.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <SignInButton />
            </Button>
            <Button asChild>
              <SignUpButton />
            </Button>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Fetching your words...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {words?.length ? (
              words.map((word) => <WordItem key={word.id} {...word} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No words found in the dictionary.
                </p>
              </div>
            )}
          </div>
        )}
      </SignedIn>
    </main>
  );
};

export default Words;
