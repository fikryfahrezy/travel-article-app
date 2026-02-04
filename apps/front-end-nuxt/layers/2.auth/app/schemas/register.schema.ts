import z from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type RegisterFormFieldErrors = {
  [P in keyof RegisterFormSchema]?: string[];
};
