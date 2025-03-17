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

export function AddWordModal() {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { word: string }) => {
      const response = await fetch("/api/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: (result) => {
      console.log("Word created:", result);
      queryClient.invalidateQueries({ queryKey: ["words"] });
      setOpen(false);
      setWord("");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({ word });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Word</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Word</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
