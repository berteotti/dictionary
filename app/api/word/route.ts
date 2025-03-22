import { NextRequest, NextResponse } from "next/server";
import { createWord } from "@/lib/db/queries";
import { groqModel } from "@/lib/ai/groq";
import { generateText } from "ai";
import { getPrompt } from "@/prompt";
import { auth } from "@clerk/nextjs/server";
import { getLanguagesObject } from "../../../lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { word, language } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word is required and must be a string" },
        { status: 400 }
      );
    }

    if (!language || !getLanguagesObject()[language]) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    if (word.trim().split(" ").length > 1) {
      return NextResponse.json(
        { error: "Can't contain more than 1 word" },
        { status: 400 }
      );
    }

    const trimmedWord = word.trim();
    const capitalziedWord =
      trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1).toLowerCase();

    const languageName = getLanguagesObject()[language].englishName;

    const { text: definition } = await generateText({
      model: groqModel,
      system: getPrompt(languageName),
      prompt: word,
    });

    const createdWord = await createWord(
      userId,
      capitalziedWord,
      definition,
      language
    );

    return NextResponse.json({ id: createdWord.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "Failed to create word" },
      { status: 500 }
    );
  }
}
