import { generateToken } from "../lib/auth.ts"
import { errorResponse } from "../utils/errors.ts"

export async function login(req: Request): Promise<Response> {
    const { username, password } = await req.json()

    if (username === "admin" && password === "secret") {
        const token = generateToken() // this adds token internally
        return new Response(JSON.stringify({ token }), {
            headers: { "Content-Type": "application/json" },
        })
    }

    return errorResponse("Unauthorized", 401)
}
