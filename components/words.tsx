import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "../lib/utils";

type Word = {
  id: string;
  word: string;
  definition: string;
};

export function WordItem({
  word,
  definition,
}: Pick<Word, "word" | "definition">) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg",
          isOpen && "bg-slate-100 dark:bg-slate-800"
        )}
      >
        <h3 className="text-lg font-medium dark:text-white">{word}</h3>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <pre className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {definition}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
