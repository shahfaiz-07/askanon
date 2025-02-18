import connect from "@/config/db.config";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connect()
    try {
        
    } catch (error) {
        
    }
}