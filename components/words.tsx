import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "../lib/utils";
import { EditWordModal } from "./edit-word-modal";
import { DeleteWordModal } from "./delete-word-modal";
import { Button } from "./ui/button";
import { RotateCwIcon, TrashIcon } from "lucide-react";
import { Word } from "../lib/db/schema";

export function WordItem({
  id,
  word,
  definition,
}: Pick<Word, "id" | "word" | "definition">) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        asChild
        className={cn(
          "group w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg",
          isOpen && "bg-slate-100 dark:bg-slate-800"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium dark:text-white">{word}</h3>
          <div className="flex gap-2">
            {isOpen && (
              <Button
                variant="ghost"
                className="h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
              >
                <RotateCwIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              className={cn(
                "h-7 w-7 hover:bg-slate-200 dark:hover:bg-slate-700",
                isOpen ? "flex" : "hidden group-hover:flex"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <pre className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {definition}
        </pre>
      </CollapsibleContent>

      <EditWordModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={id}
        word={word}
      />

      <DeleteWordModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        id={id}
        word={word}
      />
    </Collapsible>
  );
}
