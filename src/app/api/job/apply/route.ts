// app/api/job/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SITE_KEY } from "@/lib/atoms/siteKeyAtom";

// ✅ Node ランタイム（Edge では nodemailer が動きません）
export const runtime = "nodejs";
// 予約/問い合わせはキャッシュしない
export const dynamic = "force-dynamic";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SENDER_EMAIL,
} = process.env;

// OAuth Playground でリフレッシュトークンを発行している前提
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

/* ----------------------------- utils ----------------------------- */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^[0-9+\-() ]{8,}$/.test(v); // シンプル検証

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Firestore から ownerEmail を取得。
 *  1) siteSettings/{SITE_KEY}
 *  2) 見つからなければ siteSettingsEditable/{SITE_KEY}
 *  3) それでもダメなら null
 */
async function resolveOwnerEmail(): Promise<string | null> {
  if (!SITE_KEY) return null;

  // 1) siteSettings
  try {
    const ref1 = doc(db, "siteSettings", SITE_KEY);
    const snap1 = await getDoc(ref1);
    if (snap1.exists()) {
      const email = snap1.data()?.ownerEmail as string | undefined;
      if (email && isEmail(email)) return email;
    }
  } catch {}

  // 2) siteSettingsEditable
  try {
    const ref2 = doc(db, "siteSettingsEditable", SITE_KEY);
    const snap2 = await getDoc(ref2);
    if (snap2.exists()) {
      const email = snap2.data()?.ownerEmail as string | undefined;
      if (email && isEmail(email)) return email;
    }
  } catch {}

  // 3) 取得失敗
  return null;
}

/* ----------------------------- handler ----------------------------- */

export async function POST(req: NextRequest) {
  // ✅ date/time を使わないバージョン
  let payload: {
    name?: string;
    email?: string;
    phone?: string;
    contactMethod?: "phone" | "email" | "line";
    address?: string;
    notes?: string;   // 新フォームの自由記述
    message?: string; // 旧フォーム互換
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON のパースに失敗しました" },
      { status: 400 }
    );
  }

  // 正規化
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const phone = (payload.phone || "").trim();
  const contactMethod = (payload.contactMethod || "").trim() as
    | "phone"
    | "email"
    | "line"
    | "";
  const address = (payload.address || "").trim();
  const notes = (payload.notes || "").trim();
  const messageRaw = (payload.message || "").trim();

  // ✅ 必須チェック（date/time なし）
  if (!name) {
    return NextResponse.json({ error: "お名前は必須です" }, { status: 400 });
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: "メールアドレスが未入力か形式が不正です" },
      { status: 400 }
    );
  }
  // phone は任意。入っていれば形式チェック
  if (phone && !isPhone(phone)) {
    return NextResponse.json(
      { error: "電話番号の形式が不正です" },
      { status: 400 }
    );
  }
  // 内容は notes または message のいずれか必須
  const content = notes || messageRaw;
  if (!content) {
    return NextResponse.json(
      { error: "ご要望・相談内容（またはメッセージ）を入力してください" },
      { status: 400 }
    );
  }

  // env チェック
  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_REFRESH_TOKEN ||
    !SENDER_EMAIL
  ) {
    return NextResponse.json(
      { error: "メール送信設定(env)が不足しています" },
      { status: 500 }
    );
  }

  try {
    // 宛先解決
    let ownerEmail = await resolveOwnerEmail();
    if (!ownerEmail) {
      console.warn(
        "[job/apply] ownerEmail を Firestore から取得できませんでした。SENDER_EMAIL を宛先に使用します。"
      );
      ownerEmail = SENDER_EMAIL!;
    }

    // OAuth2 アクセストークン
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

    const accessTokenRes = await oAuth2Client.getAccessToken();
    const token =
      typeof accessTokenRes === "string"
        ? accessTokenRes
        : accessTokenRes?.token;

    if (!token) {
      console.error("アクセストークン取得失敗:", accessTokenRes);
      return NextResponse.json(
        { error: "アクセストークンの取得に失敗しました" },
        { status: 500 }
      );
    }

    // Nodemailer
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: token,
      },
    });

    // 件名・本文（date/time なし）
    const subject = `【ご依頼】${name} 様よりお問い合わせ`;

    const textBody = [
      "■ ご依頼内容が届きました",
      "",
      `■ お名前: ${name}`,
      `■ メール: ${email}`,
      phone ? `■ 電話: ${phone}` : null,
      `■ 連絡方法: ${contactMethod || "（未指定）"}`,
      address ? `■ ご住所: ${address}` : null,
      "",
      "■ ご要望・相談内容:",
      content,
      "",
      `※このメールに返信すると、お客様（${email}）へ返信できます。`,
    ]
      .filter(Boolean)
      .join("\n");

    const htmlBody = `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;line-height:1.7">
        <h2 style="margin:0 0 12px">ご依頼内容が届きました</h2>
        <table style="border-collapse:collapse">
          <tr><td style="padding:2px 8px 2px 0"><strong>お名前</strong></td><td>${escapeHtml(
            name
          )}</td></tr>
          <tr><td style="padding:2px 8px 2px 0"><strong>メール</strong></td><td>${escapeHtml(
            email
          )}</td></tr>
          ${
            phone
              ? `<tr><td style="padding:2px 8px 2px 0"><strong>電話</strong></td><td>${escapeHtml(
                  phone
                )}</td></tr>`
              : ""
          }
          <tr><td style="padding:2px 8px 2px 0"><strong>連絡方法</strong></td><td>${escapeHtml(
            contactMethod || "（未指定）"
          )}</td></tr>
          ${
            address
              ? `<tr><td style="padding:2px 8px 2px 0"><strong>ご住所</strong></td><td>${escapeHtml(
                  address
                )}</td></tr>`
              : ""
          }
        </table>

        <h3 style="margin:16px 0 8px">ご要望・相談内容</h3>
        <pre style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:8px">${escapeHtml(
          content
        )}</pre>

        <p style="margin-top:16px;color:#666">
          このメールに返信すると、お客様（${escapeHtml(email)}）へ返信できます。
        </p>
      </div>
    `;

    // 送信
    await transport.sendMail({
      from: `ご依頼フォーム <${SENDER_EMAIL}>`,
      to: ownerEmail,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
