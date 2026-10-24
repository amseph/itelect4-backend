import "dotenv/config";
import { reviewProject } from "./ai/gemini";

async function tryAi() {
  const review = await reviewProject(
    "I want to reserve a campus study room for four students " +
    "to review our database lessons next Tuesday from 2 PM to 4 PM. " +
    "We need a whiteboard and a quiet space, but I have not " +
    "checked room availability yet."
  );

  console.log(JSON.stringify(review, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});
