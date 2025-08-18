import z from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type LoginFormFieldErrors = { [P in keyof LoginFormSchema]?: string[] };

export const registerFormSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type RegisterFormFieldErrors = {
  [P in keyof RegisterFormSchema]?: string[];
};
