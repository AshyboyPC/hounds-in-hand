import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SITE_KEY = "0x4AAAAAAFiphPvWSS_zD1E-";
const HOSTS = new Set(["connect4paws.org", "www.connect4paws.org"]);
const COOKIE = "__Host-c4p_verified";
const LIFETIME = 3600;
const ACTION = "site-entry";
const VERIFY_PATH = "/__verify";

export const config = { runtime: "nodejs", matcher: "/:path*" };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function localPath(value: string | null, origin: string) {
  if (!value || value.length > 4096 || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const url = new URL(value, origin);
    return url.origin === origin && url.pathname !== VERIFY_PATH ? url.pathname + url.search : "/";
  } catch { return "/"; }
}

function signature(expiry: string, hostname: string, secret: string) {
  return createHmac("sha256", secret).update(`c4p-entry-v1:${hostname}:${expiry}`).digest("hex");
}

function verified(request: Request, hostname: string, secret: string) {
  const value = request.headers.get("cookie")?.split(";").map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return false;
  const [expiry, mac] = value.split(".");
  const now = Math.floor(Date.now() / 1000);
  if (Number(expiry) <= now || Number(expiry) > now + LIFETIME) return false;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(expiry, hostname, secret), "hex"));
}

function page(returnTo: string, message = "", status = 200) {
  const nonce = randomBytes(18).toString("base64");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Verify your visit | Connect 4 Paws</title>
<style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:24px;background:#f3f6fb;color:#263b58;font:16px/1.6 system-ui,sans-serif}main{width:100%;max-width:480px;background:white;border:1px solid #dae3ef;border-radius:24px;padding:40px 28px;text-align:center;box-shadow:0 16px 50px #244a7a0b}img{width:84px;height:84px;object-fit:contain}small{display:block;color:#416aab;font-weight:700;letter-spacing:.05em;margin-top:12px}h1{font-size:30px;line-height:1.2;margin:20px 0 12px;color:#315fa3}p{color:#58677c;margin:0 0 24px}form{display:grid;justify-items:center;gap:18px}.cf-turnstile{min-height:65px;max-width:100%}button{width:100%;padding:13px;border:0;border-radius:12px;background:#315fa3;color:white;font:600 16px system-ui;cursor:pointer}button:disabled{opacity:.45;cursor:wait}button:focus-visible,a:focus-visible{outline:3px solid #e7a84b;outline-offset:4px}.note{font-size:13px;margin:24px 0 0}.error{color:#a43131;font-size:14px;margin:12px 0}.success{color:#315fa3;font-size:14px;margin:12px 0}a{color:#315fa3}@media(max-width:360px){body{padding:12px}main{padding:28px 14px}}</style></head><body><main>
<img src="/connect_4_paws_logo.png" alt="Connect 4 Paws"><small>CONNECT 4 PAWS</small><h1>A quick check before you enter</h1><p>Please verify you're human to help keep our community safe.</p>
<p role="status" class="error" id="verification-status">${escapeHtml(message)}</p>
<form action="${VERIFY_PATH}" method="post"><input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}"><div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-action="${ACTION}" data-size="flexible" data-callback="onVerified" data-expired-callback="onExpired" data-error-callback="onError"></div><button id="continue" type="submit" disabled>Continue to Connect 4 Paws</button></form>
<noscript><p class="error">Please enable JavaScript to complete verification.</p></noscript><p class="note">Once verified, you can browse for an hour without repeating this check.</p>
<script nonce="${nonce}">const button=document.getElementById('continue'),status=document.getElementById('verification-status');window.onVerified=function(){button.disabled=false;status.className='success';status.textContent='Verification complete. You can continue.'};window.onExpired=function(){button.disabled=true;status.className='error';status.textContent='Verification expired. Please try again.'};window.onError=function(){button.disabled=true;status.className='error';status.textContent='Unable to load verification. Please refresh and try again.'};document.querySelector('form').addEventListener('submit',function(){button.disabled=true;button.textContent='Checking…'});</script><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></main></body></html>`;
  return new Response(html, { status, headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "Vary": "Cookie",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'nonce-${nonce}'; img-src 'self'; frame-src https://challenges.cloudflare.com; connect-src https://challenges.cloudflare.com; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
  } });
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  // Vercel aliases share the canonical site's verification instead of exposing a bypass.
  if (!HOSTS.has(url.hostname)) {
    return new Response(null, { status: 307, headers: { Location: `https://www.connect4paws.org${url.pathname}${url.search}`, "Cache-Control": "no-store" } });
  }
  if (["/connect_4_paws_logo.png", "/favicon.ico"].includes(url.pathname)) {
    return new Response(null, { headers: { "x-middleware-next": "1" } });
  }
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return new Response("Verification is temporarily unavailable. Please try again shortly.", { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } });

  if (url.pathname === VERIFY_PATH && request.method === "POST") {
    if (request.headers.get("origin") !== url.origin) return new Response("Invalid request origin.", { status: 403, headers: { "Cache-Control": "no-store" } });
    if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded") || Number(request.headers.get("content-length") || 0) > 8192) {
      return new Response("Invalid verification request.", { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    let data: URLSearchParams;
    try {
      const body = await request.text();
      if (body.length > 8192) throw new Error("Request too large");
      data = new URLSearchParams(body);
    } catch { return page("/", "Please try verification again.", 400); }
    const returnTo = localPath(data.get("returnTo"), url.origin);
    const token = data.get("cf-turnstile-response");
    if (!token || token.length > 2048) return page(returnTo, "Please complete the verification before continuing.", 400);
    try {
      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Verification service unavailable");
      const result = await response.json();
      if (result.success !== true || result.hostname !== url.hostname || result.action !== ACTION) return page(returnTo, "Verification wasn't accepted. Please try again.", 400);
      const expiry = String(Math.floor(Date.now() / 1000) + LIFETIME);
      return new Response(null, { status: 303, headers: {
        Location: returnTo,
        "Set-Cookie": `${COOKIE}=${expiry}.${signature(expiry, url.hostname, secret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${LIFETIME}`,
        "Cache-Control": "private, no-store",
      } });
    } catch { return page(returnTo, "Verification is temporarily unavailable. Please try again.", 503); }
  }
  if (verified(request, url.hostname, secret)) {
    // Same continuation header as Vercel's next() helper, without an extra dependency.
    return new Response(null, { headers: { "x-middleware-next": "1", "Cache-Control": "private, no-store", "Vary": "Cookie" } });
  }
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Verification required.", { status: 403, headers: { "Cache-Control": "no-store" } });
  const destination = url.pathname === VERIFY_PATH ? localPath(url.searchParams.get("returnTo"), url.origin) : url.pathname + url.search;
  return page(destination);
}
