"use client";

import { WordItem } from "../components/words";
import { useQuery } from "@tanstack/react-query";
import { AddWordModal } from "../components/add-word-modal";
import { Word } from "../lib/db/schema";

const Words: React.FC = () => {
  const { data: words } = useQuery({
    queryKey: ["words"],
    queryFn: async (): Promise<Word[]> => {
      const response = await fetch("/api/words");
      return await response.json();
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dictionary</h1>
        <AddWordModal />
      </div>
      <div className="space-y-4">
        {words?.length ? (
          words.map((word) => (
            <WordItem
              key={word.id}
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
