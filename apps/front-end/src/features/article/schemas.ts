import z from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
});

export type ArticleFormSchema = z.infer<typeof articleFormSchema>;
export type ArticleFormFieldErrors = {
  [P in keyof ArticleFormSchema]?: string[];
};

export const commentFormSchema = z.object({
  content: z.string().min(1),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;
export type CommentFormFieldErrors = {
  [P in keyof CommentFormSchema]?: string[];
};
