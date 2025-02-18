import { z } from "zod";

export const contactSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        message: z.string().min(10, "Message must be at least 10 characters"),
        phone: z.string().regex(/^[0-9]*$/, "Phone number can only contain numbers").optional(),
        isExistingUser: z.boolean(),
        username: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.isExistingUser) {
                return !!data.username;
            }
            return true;
        },
        {
            message: "Username is required for existing users",
            path: ["username"], // This will ensure the error is displayed on the username field
        }
    );