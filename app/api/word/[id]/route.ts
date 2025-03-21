import { NextRequest, NextResponse } from "next/server";
import { deleteWord, editWord, fetchWord } from "@/lib/db/queries";
import { groqModel } from "@/lib/ai/groq";
import { generateText } from "ai";
import { prompt } from "@/prompt";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Word ID is required" },
        { status: 400 }
      );
    }

    const word = await fetchWord(id);

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    if (word.userId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.json(word, { status: 200 });
  } catch (error) {
    console.error("Error fetching word:", error);
    return NextResponse.json(
      { error: "Failed to fetch word" },
      { status: 500 }
    );
  }
}

export async function PUT(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!id) {
      return NextResponse.json(
        { error: "Word ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const word = await fetchWord(id);

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    if (word.userId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { text: definition } = await generateText({
      model: groqModel,
      system: `${prompt}
      
      Try a differnt approach.`,
      prompt: word.word,
    });

    await editWord(id, word.word, definition);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating word:", error);
    return NextResponse.json(
      { error: "Failed to update word" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Word ID is required" },
        { status: 400 }
      );
    }

    await deleteWord(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting word:", error);
    return NextResponse.json(
      { error: "Failed to delete word" },
      { status: 500 }
    );
  }
}
