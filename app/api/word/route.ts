import { NextRequest, NextResponse } from "next/server";
import { createWord } from "@/lib/db/queries";
import { groqModel } from "@/lib/ai/groq";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word is required and must be a string" },
        { status: 400 }
      );
    }
    const { text } = await generateText({
      model: groqModel,
      system:
        "You are a word definition assitant. Your goal is to give a dictionary style definition of the word that will be given. Answer in portuguese from Portugal.",
      prompt: word,
    });

    const createdWord = await createWord(word, text);

    return NextResponse.json({ id: createdWord.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "Failed to create word" },
      { status: 500 }
    );
  }
}
