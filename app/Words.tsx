"use client";

import { WordItem } from "../components/words";
import { useQuery } from "@tanstack/react-query";
import { AddWordModal } from "../components/add-word-modal";
import { Word } from "../lib/db/schema";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";

const Words: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: words } = useQuery({
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dictionary</h1>
        <div className="flex gap-2">
          {mounted && (
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
          )}
          <AddWordModal />
        </div>
      </div>
      <div className="space-y-4">
        {words?.length ? (
          words.map((word) => (
            <WordItem
              key={word.id}
              id={word.id}
              word={word.word}
              definition={word.definition}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No words found in the dictionary.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Words;
