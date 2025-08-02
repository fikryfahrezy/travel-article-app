import z from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export type ArticleFormSchema = z.infer<typeof articleFormSchema>;
export type ArticleFormFieldErrors = {
  [P in keyof ArticleFormSchema]?: string[];
};
