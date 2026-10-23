import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import middleware from "./middleware.ts";

process.env.TURNSTILE_SECRET_KEY = "synthetic-test-secret";
const origin = "https://www.connect4paws.org";
const originalFetch = globalThis.fetch;

function submission(token = "synthetic-token", returnTo = "/donate?from=home") {
  return new Request(origin + "/__verify", { method: "POST", headers: { Origin: origin }, body: new URLSearchParams({ "cf-turnstile-response": token, returnTo }) });
}

async function accepted(returnTo?: string) {
  globalThis.fetch = async () => Response.json({ success: true, hostname: "www.connect4paws.org", action: "site-entry" });
  try { return await middleware(submission("synthetic-token", returnTo)); }
  finally { globalThis.fetch = originalFetch; }
}

test("public pages, direct index, and app assets require verification", async () => {
  for (const path of ["/", "/about", "/donate", "/index.html", "/assets/app.js"]) {
    const response = await middleware(new Request(origin + path));
    assert.equal(response.headers.get("x-middleware-next"), null);
    assert.match(await response.text(), /A quick check before you enter/);
    assert.match(response.headers.get("cache-control")!, /no-store/);
  }
});

test("successful server verification issues a secure cookie and preserves the destination", async () => {
  const response = await accepted();
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/donate?from=home");
  const cookie = response.headers.get("set-cookie")!;
  assert.match(cookie, /HttpOnly; Secure; SameSite=Lax; Max-Age=3600/);
  const visit = await middleware(new Request(origin + "/donate", { headers: { cookie: cookie.split(";")[0] } }));
  assert.equal(visit.headers.get("x-middleware-next"), "1");
});

test("tampered, expired, and different-host cookies cannot unlock the website", async () => {
  const successful = await accepted();
  const cookie = successful.headers.get("set-cookie")!.split(";")[0];
  const expiry = String(Math.floor(Date.now() / 1000) - 1);
  const signature = createHmac("sha256", process.env.TURNSTILE_SECRET_KEY!).update(`c4p-entry-v1:www.connect4paws.org:${expiry}`).digest("hex");
  for (const [url, value] of [[origin, cookie.slice(0, -1) + (cookie.endsWith("a") ? "b" : "a")], [origin, `__Host-c4p_verified=${expiry}.${signature}`], ["https://connect4paws.org", cookie]]) {
    assert.equal((await middleware(new Request(url + "/", { headers: { cookie: value } }))).headers.get("x-middleware-next"), null);
  }
});

test("missing, rejected, wrong-host, and wrong-action tokens never issue cookies", async () => {
  const empty = await middleware(submission(""));
  assert.equal(empty.status, 400);
  for (const result of [{ success: false }, { success: true, hostname: "other.example", action: "site-entry" }, { success: true, hostname: "www.connect4paws.org", action: "login" }]) {
    globalThis.fetch = async () => Response.json(result);
    try {
      const response = await middleware(submission());
      assert.equal(response.status, 400);
      assert.equal(response.headers.get("set-cookie"), null);
    } finally { globalThis.fetch = originalFetch; }
  }
});

test("cross-origin submissions are blocked without contacting Cloudflare", async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error("Unexpected call"); };
  try {
    const request = submission();
    request.headers.set("origin", "https://other.example");
    assert.equal((await middleware(request)).status, 403);
    assert.equal(called, false);
  } finally { globalThis.fetch = originalFetch; }
});

test("return addresses cannot redirect visitors to external websites", async () => {
  for (const returnTo of ["https://other.example", "//other.example", "/\\other.example", "/__verify"]) {
    assert.equal((await accepted(returnTo)).headers.get("location"), "/");
  }
});

test("service failure stays closed and allows a retry", async () => {
  globalThis.fetch = async () => { throw new Error("Synthetic timeout"); };
  try {
    const response = await middleware(submission());
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.match(await response.text(), /Please try again/);
  } finally { globalThis.fetch = originalFetch; }
});

test("unconfigured hosting fails closed and Vercel aliases redirect to the protected domain", async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  try { assert.equal((await middleware(new Request(origin))).status, 503); }
  finally { process.env.TURNSTILE_SECRET_KEY = "synthetic-test-secret"; }
  const alias = await middleware(new Request("https://hounds-in-hand.vercel.app/about"));
  assert.equal(alias.headers.get("location"), origin + "/about");
});
