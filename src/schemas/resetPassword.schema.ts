import { z } from "zod";
import { passwordValidation } from "./signup.schema";

export const resetPasswordSchema = z.object({
    password: passwordValidation,
    confirmPassword: z.string()
})