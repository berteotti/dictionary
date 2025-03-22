"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLanguages, getLanguagesObject } from "@/lib/utils";

export function AddWordModal() {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState(getLanguagesObject()["en"].code);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { word: string; language: string }) => {
      const response = await fetch("/api/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      setOpen(false);
      setWord("");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ word, language });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Word</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Word</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <p>Definition in</p>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {getLanguages().map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.englishName} {lang.flag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between flex-row-reverse">
            <Button type="submit" disabled={mutation.isPending}>
              Save
            </Button>
            {mutation.isPending && <p>Creating definiton...</p>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
