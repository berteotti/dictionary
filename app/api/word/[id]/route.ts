import { NextRequest, NextResponse } from "next/server";
import { deleteWord, editWord, fetchWord } from "@/lib/db/queries";
import { groqModel } from "@/lib/ai/groq";
import { generateText } from "ai";

export async function GET(
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

    const word = await fetchWord(id);

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { word } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Word ID is required" },
        { status: 400 }
      );
    }

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word is required and must be a string" },
        { status: 400 }
      );
    }
    const { text } = await generateText({
      model: groqModel,
      system: `You are a word definition assitant. Your goal is to give a dictionary style definition of the word that will be given. Answer in portuguese from Portugal.

      Make sure to follow the following structure in the example below:
      Vestíbulo: nome masculino

      1. Espaço de entrada de um edifício, geralmente amplo e decorado, que serve de acesso às diferentes partes do interior.
      2. Área de entrada de um teatro, cinema ou outro local de espetáculo, onde os espectadores aguardam a abertura das portas ou se reúnem antes do início do espetáculo.
      3. Em anatomia, designa uma cavidade ou espaço no interior de um órgão ou estrutura, como o vestíbulo do ouvido ou o vestíbulo da bexiga.
      4. Figuradamente, pode designar um local de acesso ou entrada para algo, como um vestíbulo para o conhecimento ou um vestíbulo para a carreira.

      Exemplos:
      - O vestíbulo do hotel era impressionante, com um lustre enorme e um chão de mármore.
      `,
      prompt: word,
    });

    await editWord(id, word, text);

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
  req: NextRequest,
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
