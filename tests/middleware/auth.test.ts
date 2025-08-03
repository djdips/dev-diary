import {
    assert,
    assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { withAuth } from "../../middleware/auth.ts";
import { tokenStore } from "../../lib/auth.ts";

// Extend globalThis type to include our custom properties
declare global {
  var isTokenValid: (token: string) => boolean;
}

Deno.test("withAuth - valid token allows access", async () => {
    const testToken = "test-token";
  
    tokenStore.set(testToken, {
      token: testToken,
      expiresAt: Date.now() + 60_000,
    });
  
    const req = new Request("http://localhost", {
      headers: { Authorization: `Bearer ${testToken}` },
    });
  
    const response = await withAuth(req,  () =>
        Promise.resolve(new Response("ok", { status: 200 }))
    );
  
    assertEquals(response.status, 200);
  });

  Deno.test("Edge: withAuth rejects expired token", async () => {
    const testToken = "test-token";
  
    tokenStore.set(testToken, {
      token: testToken,
      expiresAt: Date.now() - 1000,
    });
  
    const req = new Request("http://localhost/posts", {
      headers: new Headers({ Authorization: `Bearer ${testToken}` }),
    });
  
    const res = await withAuth(req, () => Promise.resolve(new Response("OK")));
    assertEquals(res.status, 401);
  });
  
  Deno.test("withAuth - missing or invalid token denies access", async () => {
    // Dummy handler should NOT be called
    function dummyHandler(): Promise<Response> {
      throw new Error("Should not be called");
    }
  
    // Mock isTokenValid to reject all tokens
    const originalIsTokenValid = globalThis.isTokenValid;
    globalThis.isTokenValid = () => false;
  
    // No token
    const req1 = new Request("http://localhost/protected");
    const res1 = await withAuth(req1, dummyHandler);
    assertEquals(res1.status, 401);
  
    // Invalid token
    const req2 = new Request("http://localhost/protected", {
      headers: { Authorization: "Bearer invalid" },
    });
    const res2 = await withAuth(req2, dummyHandler);
    assertEquals(res2.status, 401);
  
    // Restore
    globalThis.isTokenValid = originalIsTokenValid;
  });


