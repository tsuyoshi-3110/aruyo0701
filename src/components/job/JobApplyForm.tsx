// components/job/JobApplyForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useThemeGradient } from "@/lib/useThemeGradient";
import { THEMES, ThemeKey } from "@/lib/themes";
import { MessageSquareMore } from "lucide-react";

/* ===============================
   設定
================================ */

const DARK_KEYS: ThemeKey[] = ["brandH", "brandG", "brandI"];

// 連絡方法（API 用に保持。UIは出さず既定値 "phone"）
const CONTACT_METHODS = [
  { key: "phone", label: "電話" },
  { key: "email", label: "メール" },
  { key: "line", label: "LINE" },
] as const;

/* ===============================
   バリデーション
   ※ date / time は撤去
================================ */

const schema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  phone: z
    .string()
    .min(8, "電話番号を入力してください")
    .regex(/^[0-9+\-() ]+$/, "半角数字・記号で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスの形式が不正です"),
  contactMethod: z.enum(["phone", "email", "line"]), // UI 非表示の内部必須
  address: z.string().min(1, "ご住所を入力してください"),
  notes: z
    .string()
    .min(1, "ご要望・相談内容を入力してください")
    .max(1000, "ご要望が長すぎます"),
});
type FormValues = z.infer<typeof schema>;

/* ===============================
   コンポーネント
================================ */

export default function JobApplyForm() {
  const gradient = useThemeGradient();
  const isDark =
    gradient &&
    DARK_KEYS.includes(
      Object.keys(THEMES).find(
        (k) => THEMES[k as ThemeKey] === gradient
      ) as ThemeKey
    );
  const textClass = isDark ? "text-white" : "text-black";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      contactMethod: "phone", // UI 非表示の内部必須
      address: "",
      notes: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [doneModal, setDoneModal] = useState<null | { name: string }>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/job/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // siteKey は送らない（API 側で解決）
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          phone: v.phone,
          message: [
            `【ご依頼フォーム】`,
            `■ 連絡方法: ${
              CONTACT_METHODS.find((c) => c.key === v.contactMethod)?.label ??
              v.contactMethod
            }`,
            `■ ご住所: ${v.address}`,
            "",
            "■ ご要望・相談内容:",
            v.notes,
          ].join("\n"),
          // 将来拡張用に個別も同梱（APIは date/time 不要）
          contactMethod: v.contactMethod,
          address: v.address,
          notes: v.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error ?? "送信に失敗しました。");
        return;
      }
      reset({
        name: "",
        phone: "",
        email: "",
        contactMethod: "phone",
        address: "",
        notes: "",
      });
      setDoneModal({ name: v.name });
    } catch (e: any) {
      setErrorMsg(e?.message ?? "送信に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={clsx("space-y-6", textClass)}>
      <div className="rounded-2xl border shadow-sm backdrop-blur bg-white/80">
        <div className="px-5 pt-5 pb-3 border-b bg-white/60 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageSquareMore className="h-5 w-5 text-black" />
            <h2 className="text-base font-semibold text-black">ご依頼内容</h2>
          </div>
          <p className="mt-1 text-xs text-black/70">
            全ての項目をご入力ください。担当者より折り返しご連絡いたします。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
          {/* お名前 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">お名前</label>
            <Input
              placeholder="山田 太郎"
              {...register("name")}
              className="text-black"
              required
              aria-required
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* 電話番号 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">電話番号</label>
            <Input
              placeholder="09012345678"
              {...register("phone")}
              className="text-black"
              required
              aria-required
              inputMode="tel"
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">
              メールアドレス
            </label>
            <Input
              type="email"
              placeholder="example@example.com"
              {...register("email")}
              className="text-black"
              required
              aria-required
              inputMode="email"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* ご住所 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">ご住所</label>
            <Input
              placeholder="例）兵庫県西宮市高須町1-1-4-613"
              {...register("address")}
              className="text-black"
              required
              aria-required
            />
            {errors.address && (
              <p className="text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* ご要望（必須） */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">
              ご要望・相談内容
            </label>
            <Textarea
              rows={6}
              placeholder="ご依頼内容・ご相談事項をご記入ください"
              {...register("notes")}
              className="text-black"
              required
              aria-required
            />
            {errors.notes && (
              <p className="text-xs text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* 送信エラー */}
          {errorMsg && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* 送信ボタン */}
          <div className="pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "送信中…" : "この内容で依頼する"}
            </Button>
          </div>
        </form>
      </div>

      {/* 成功モーダル（白背景・黒文字固定） */}
      {doneModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-xl text-black">
            <div className="text-base font-semibold mb-2">
              送信が完了しました
            </div>
            <p className="text-sm mb-4">
              {doneModal.name} 様、ありがとうございます。
              <br />
              担当者より折り返しご連絡いたします。
            </p>
            <div className="text-right">
              <Button onClick={() => setDoneModal(null)}>閉じる</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
