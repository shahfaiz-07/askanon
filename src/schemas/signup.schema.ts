import {z} from 'zod'

export const usernameValidation = z.string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username cannot be more that 20 characters")
    .regex(/^[0-9a-zA-Z]+$/, "Username must not contain special characters")

export const emailValidation = z.string().email({ message: "Invalid email address" });

export const passwordValidation = z
    .string()
    .min(6, {message: "Password must be atleast 6 characters"})

export const signupSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
    firstname: z
        .string()
        .max(20, "Firstname cannot be more than 20 characters"),
    lastname: z
        .string()
        .max(20, "Lastname cannot be more than 20 characters")
        .optional(),
});