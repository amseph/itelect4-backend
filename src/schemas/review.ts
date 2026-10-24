import { z } from "zod";

export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your study session in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

export const reviewSchema = z.object({
  summary: z.string().describe(
    "One sentence summarizing the proposed study room reservation or study session."
  ),
  strengths: z.array(z.string()).min(1).max(3).describe(
    "One to three positive aspects of the proposed study session."
  ),
  improvements: z.array(z.string()).min(1).max(3).describe(
    "One to three practical suggestions to improve the reservation plan."
  ),
  readiness: z.enum(["ready", "almost", "not-yet"]).describe(
    "How prepared the student is to proceed with the reservation."
  ),
});

export type Review = z.infer<typeof reviewSchema>;
export const reviewJsonSchema = z.toJSONSchema(reviewSchema);
