import { z } from "zod";

const normalizedLine = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((value) => value.replace(/\s+/g, " "));

const baseFields = {
  name: normalizedLine(80),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  website: z.string().max(0, "Spam check failed."),
  turnstileToken: z.string().min(1, "Please complete the verification check.").max(2048),
};

export const contactSchema = z.object({
  ...baseFields,
  subject: z
    .string()
    .trim()
    .max(120)
    .transform((value) => value.replace(/\s+/g, " "))
    .optional()
    .default(""),
  message: z.string().trim().min(10, "Please add a little more detail.").max(4000),
});

export const ongoingProjectSlugs = ["tripshield", "job-automation", "technical-portfolio"] as const;

export const suggestionSchema = z.object({
  ...baseFields,
  projectSlug: z.enum(ongoingProjectSlugs),
  suggestion: z.string().trim().min(10, "Please add a little more detail.").max(3000),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactInput = z.output<typeof contactSchema>;
export type SuggestionInput = z.infer<typeof suggestionSchema>;
