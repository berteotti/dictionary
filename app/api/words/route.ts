import { NextResponse } from "next/server";
import { fetchWords } from "@/lib/db/queries";

export async function GET() {
  try {
    const words = await fetchWords();
    return NextResponse.json(words, { status: 200 });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
