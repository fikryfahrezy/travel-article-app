import z from "zod";

export const commentFormSchema = z.object({
  content: z.string().min(1),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;
export type CommentFormFieldErrors = {
  [P in keyof CommentFormSchema]?: string[];
};
