import z from 'zod'


export const authSchema = {
  register: z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};