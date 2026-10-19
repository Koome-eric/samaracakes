const E = process.env;
const BASE = E.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

export function normalisePhone(p) {
  const d = String(p || "").replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(d)) return "254" + d.slice(1);
  if (/^254[17]\d{8}$/.test(d)) return d;
  if (/^[17]\d{8}$/.test(d)) return "254" + d;
  return null;
}

async function token() {
  const auth = Buffer.from(`${E.MPESA_CONSUMER_KEY}:${E.MPESA_CONSUMER_SECRET}`).toString("base64");
  const r = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" });
  if (!r.ok) throw new Error("M-Pesa authentication failed. Check your consumer key and secret.");
  return (await r.json()).access_token;
}

export async function stkPush({ phone, amount, ref }) {
  const ts = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const password = Buffer.from(`${E.MPESA_SHORTCODE}${E.MPESA_PASSKEY}${ts}`).toString("base64");
  const till = E.MPESA_TYPE === "till";
  const r = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: E.MPESA_SHORTCODE, Password: password, Timestamp: ts,
      TransactionType: till ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline",
      Amount: amount, PartyA: phone, PartyB: (till && E.MPESA_PARTY_B) || E.MPESA_SHORTCODE, PhoneNumber: phone,
      CallBackURL: `${E.CALLBACK_BASE_URL}/api/mpesa/callback?s=${E.MPESA_CALLBACK_SECRET}`,
      AccountReference: ref.slice(0, 12), TransactionDesc: "Samara Cakes",
    }),
  });
  const d = await r.json();
  if (d.ResponseCode !== "0") throw new Error(d.errorMessage || d.ResponseDescription || "Could not send the M-Pesa prompt.");
  return d; // { CheckoutRequestID, MerchantRequestID, ... }
}
