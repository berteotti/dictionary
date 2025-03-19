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
