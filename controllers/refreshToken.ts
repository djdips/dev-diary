// controllers/refreshToken.ts

import { refreshToken } from "../lib/auth.ts"
import { errorResponse } from "../utils/errors.ts"

export async function refreshTokenHandler(req: Request): Promise<Response> {
    const authHeader = req.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
        return errorResponse("Unauthorized", 401)
    }

    const newToken = await refreshToken(token)
    if (!newToken) {
        return errorResponse("Unauthorized", 401)
    }

    return new Response(JSON.stringify({ token: newToken }), {
        headers: { "Content-Type": "application/json" },
    })
}
