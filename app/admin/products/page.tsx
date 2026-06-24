"use client";

import { useEffect, useMemo, useState, type DragEvent } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  FieldLabel,
  GhostButton,
  Input,
  PrimaryButton,
  Select,
  StatusPill,
  TableWrap,
  TextArea,
} from "@/components/admin/AdminUI";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminService, createId } from "@/lib/admin/service";
import type { Product, ProductEnergyAttributes, ProductStatus } from "@/lib/admin/types";
import { hasErrors, validateProductForm } from "@/lib/admin/validation";

type ProductDraft = Product & {
  subtitle: string;
  shortDescription: string;
  meritPrice: number;
  moodTags: string[];
  useCases: string[];
  meaning: string;
  practiceMeaning: string;
  practiceSteps: string[];
  contemplation: string;
  dedicationText: string;
  energyAttributes: ProductEnergyAttributes;
  relatedProductIds: string[];
};

const defaultEnergy: ProductEnergyAttributes = {
  stability: 3,
  wisdom: 3,
  focus: 3,
  healing: 3,
  balance: 3,
};

const energyMeta: Array<{ key: keyof ProductEnergyAttributes; label: string }> = [
  { key: "stability", label: "安定" },
  { key: "wisdom", label: "智慧" },
  { key: "focus", label: "專注" },
  { key: "healing", label: "療癒" },
  { key: "balance", label: "平衡" },
];

const tabs = ["基本資料", "品牌內容", "使用設定", "關聯商品"] as const;

const quickMoodTags = ["安定", "覺察", "智慧", "專注", "療癒", "平衡"];
const quickUseCases = ["晨起靜坐", "書寫祈願", "睡前安定", "情緒整理", "冥想練習", "日常調息"];
const quickPracticeTemplate = [
  "先讓心安住於呼吸中，讓念頭慢下來。",
  "輕輕拿起法物，感受它陪伴自己的安定力量。",
  "將願心放下，回到今日修持。",
  "結束前停留一分鐘，感謝當下。",
];

const emptyForm: ProductDraft = {
  id: "",
  name: "",
  subtitle: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  price: 0,
  meritAmount: 0,
  meritPrice: 0,
  stock: 0,
  status: "inactive" as ProductStatus,
  category: "法物",
  moodTags: [],
  useCases: [],
  meaning: "",
  practiceMeaning: "",
  practiceSteps: [],
  contemplation: "",
  dedicationText: "",
  energyAttributes: defaultEnergy,
  relatedProductIds: [],
  createdAt: "",
  updatedAt: "",
};

function withDefaults(row: Product | ProductDraft): ProductDraft {
  const merit = row.meritPrice ?? row.meritAmount ?? row.price;
  return {
    ...emptyForm,
    ...row,
    subtitle: row.subtitle || "",
    shortDescription: row.shortDescription || row.subtitle || "",
    price: merit,
    meritPrice: merit,
    meritAmount: merit,
    moodTags: row.moodTags || [],
    useCases: row.useCases || [],
    meaning: row.meaning || row.description || "",
    practiceMeaning: row.practiceMeaning || "",
    practiceSteps: row.practiceSteps || [],
    contemplation: row.contemplation || "",
    dedicationText: row.dedicationText || "",
    energyAttributes: row.energyAttributes || defaultEnergy,
    relatedProductIds: row.relatedProductIds || [],
  };
}

export default function ProductsAdminPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [editing, setEditing] = useState<ProductDraft>(emptyForm);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [chipInput, setChipInput] = useState({ moodTags: "", useCases: "" });
  const [relatedKeyword, setRelatedKeyword] = useState("");
  const [dragStepIndex, setDragStepIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validateProductForm>>({});
  const [message, setMessage] = useState("");

  const readOnly = modalMode === "view";

  const reload = () => adminService.products.list().then(setRows);

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    if (!keyword.trim()) return rows;
    const q = keyword.toLowerCase();
    return rows.filter((row) =>
      [row.name, row.description, row.status].some((x) => x.toLowerCase().includes(q))
    );
  }, [rows, keyword]);

  const relatedCandidates = useMemo(() => {
    const q = relatedKeyword.trim().toLowerCase();
    return rows
      .filter((row) => row.id !== editing.id)
      .filter((row) =>
        !q ? true : [row.name, row.category, row.subtitle || row.shortDescription || ""].some((x) => x.toLowerCase().includes(q))
      );
  }, [rows, relatedKeyword, editing.id]);

  const openCreate = () => {
    setEditing(withDefaults(emptyForm));
    setErrors({});
    setMessage("");
    setActiveTab(0);
    setModalMode("create");
  };

  const openEdit = (row: Product) => {
    setEditing(withDefaults(row));
    setErrors({});
    setMessage("");
    setActiveTab(0);
    setModalMode("edit");
  };

  const openView = (row: Product) => {
    setEditing(withDefaults(row));
    setErrors({});
    setMessage("");
    setActiveTab(0);
    setModalMode("view");
  };

  const openDuplicate = (row: Product) => {
    const draft = withDefaults(row);
    setEditing({
      ...draft,
      id: "",
      name: `${draft.name}（複製）`,
      createdAt: "",
      updatedAt: "",
    });
    setErrors({});
    setMessage("");
    setActiveTab(0);
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveTab(0);
    setRelatedKeyword("");
    setDragStepIndex(null);
    setChipInput({ moodTags: "", useCases: "" });
  };

  const save = async () => {
    const normalized = {
      ...editing,
      subtitle: editing.subtitle.trim(),
      shortDescription: editing.shortDescription.trim(),
      description: editing.description.trim(),
      meaning: editing.meaning.trim(),
      practiceMeaning: editing.practiceMeaning.trim(),
      contemplation: editing.contemplation.trim(),
      dedicationText: editing.dedicationText.trim(),
      moodTags: editing.moodTags.filter((x) => x.trim().length > 0),
      useCases: editing.useCases.filter((x) => x.trim().length > 0),
      practiceSteps: editing.practiceSteps.filter((x) => x.trim().length > 0),
      relatedProductIds: editing.relatedProductIds.filter((x) => x !== editing.id),
      meritAmount: editing.meritAmount ?? 0,
      meritPrice: editing.meritAmount,
      price: editing.meritAmount,
    };

    const nextErrors = validateProductForm(normalized);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setMessage("請先修正表單欄位");
      return;
    }

    const status = normalized.stock <= 0 ? "sold_out" : normalized.status;
    await adminService.products.upsert({
      ...normalized,
      meritAmount: normalized.meritAmount,
      meritPrice: normalized.meritAmount,
      price: normalized.meritAmount,
      id: normalized.id || createId("p"),
      createdAt: normalized.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
    });
    closeModal();
    reload();
  };

  const remove = async (id: string) => {
    await adminService.products.remove(id);
    reload();
  };

  const toggleStatus = async (row: Product) => {
    const current = withDefaults(row);
    const nextStatus: ProductStatus = row.status === "active" ? "inactive" : current.stock <= 0 ? "sold_out" : "active";
    await adminService.products.upsert({ ...current, status: nextStatus, updatedAt: new Date().toISOString() });
    reload();
  };

  const addItem = (field: "moodTags" | "useCases") => {
    const value = chipInput[field].trim();
    if (!value) return;
    if (editing[field].includes(value)) {
      setChipInput((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    setEditing((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    setChipInput((prev) => ({ ...prev, [field]: "" }));
  };

  const addItemDirect = (field: "moodTags" | "useCases", value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    if (editing[field].includes(normalized)) return;
    setEditing((prev) => ({ ...prev, [field]: [...prev[field], normalized] }));
    setChipInput((prev) => ({ ...prev, [field]: "" }));
  };

  const removeItem = (field: "moodTags" | "useCases", value: string) => {
    setEditing((prev) => ({ ...prev, [field]: prev[field].filter((item) => item !== value) }));
  };

  const updateStep = (index: number, value: string) => {
    setEditing((prev) => ({
      ...prev,
      practiceSteps: prev.practiceSteps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const addStep = () => {
    setEditing((prev) => ({ ...prev, practiceSteps: [...prev.practiceSteps, ""] }));
  };

  const removeStep = (index: number) => {
    setEditing((prev) => ({ ...prev, practiceSteps: prev.practiceSteps.filter((_, i) => i !== index) }));
  };

  const onStepDrop = (targetIndex: number) => {
    if (dragStepIndex === null || dragStepIndex === targetIndex) return;
    setEditing((prev) => {
      const next = [...prev.practiceSteps];
      const [moved] = next.splice(dragStepIndex, 1);
      next.splice(targetIndex, 0, moved);
      return { ...prev, practiceSteps: next };
    });
    setDragStepIndex(null);
  };

  const toggleRelated = (id: string) => {
    setEditing((prev) => {
      const exists = prev.relatedProductIds.includes(id);
      return {
        ...prev,
        relatedProductIds: exists
          ? prev.relatedProductIds.filter((item) => item !== id)
          : [...prev.relatedProductIds, id],
      };
    });
  };

  const setEnergy = (key: keyof ProductEnergyAttributes, value: number) => {
    setEditing((prev) => ({ ...prev, energyAttributes: { ...prev.energyAttributes, [key]: value } }));
  };

  const previewRelated = useMemo(
    () => rows.filter((row) => editing.relatedProductIds.includes(row.id)).slice(0, 3),
    [rows, editing.relatedProductIds]
  );

  const completion = useMemo(() => {
    const checks = [
      editing.name.trim().length > 0,
      editing.category.trim().length > 0,
      editing.subtitle.trim().length > 0,
      editing.shortDescription.trim().length > 0,
      editing.description.trim().length > 0,
      (editing.meritAmount ?? 0) > 0,
      editing.meaning.trim().length > 0,
      editing.practiceMeaning.trim().length > 0,
      editing.contemplation.trim().length > 0,
      editing.dedicationText.trim().length > 0,
      editing.moodTags.length > 0,
      editing.useCases.length > 0,
      editing.practiceSteps.filter((step) => step.trim().length > 0).length > 0,
    ];
    const done = checks.filter(Boolean).length;
    return { done, total: checks.length, percentage: Math.round((done / checks.length) * 100) };
  }, [editing]);

  return (
    <div>
      <AdminPageHeader
        title="結緣品管理"
        description="管理上架狀態、商品資訊、品牌內容與前端詳情頁完整欄位。"
      />

      <Card
        title="商品列表"
        actions={
          <div className="flex items-center gap-2">
            <Input placeholder="搜尋商品" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-[220px]" />
            <PrimaryButton onClick={openCreate}>新增商品</PrimaryButton>
          </div>
        }
      >
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">商品</th>
                  <th className="px-3 py-2 text-left">分類</th>
                  <th className="px-3 py-2 text-left">結緣金</th>
                  <th className="px-3 py-2 text-left">庫存</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)] align-top">
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.name}</p>
                      <p className="mt-1 text-xs text-[rgba(76,62,41,0.65)] line-clamp-2">{row.shortDescription || row.subtitle || row.description}</p>
                    </td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">NT$ {row.meritPrice ?? row.meritAmount ?? row.price}</td>
                    <td className="px-3 py-2">{row.stock}</td>
                    <td className="px-3 py-2">
                      <StatusPill
                        label={row.status === "active" ? "上架中" : row.status === "inactive" ? "已下架" : "完售"}
                        tone={row.status === "active" ? "ok" : row.status === "sold_out" ? "warn" : "muted"}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/products/${row.id}`} target="_blank" className="rounded-lg border border-[rgba(138,109,65,0.35)] bg-[rgba(250,247,242,0.8)] px-2.5 py-1.5 text-xs tracking-[0.08em] text-[rgba(60,42,18,0.82)] hover:bg-[rgba(138,109,65,0.08)]">
                          查看前端效果
                        </Link>
                        <GhostButton onClick={() => openView(row)} className="px-2.5 py-1.5">查看詳情</GhostButton>
                        <GhostButton onClick={() => openEdit(row)} className="px-2.5 py-1.5">編輯</GhostButton>
                        <GhostButton onClick={() => openDuplicate(row)} className="px-2.5 py-1.5">複製商品</GhostButton>
                        <GhostButton onClick={() => toggleStatus(row)} className="px-2.5 py-1.5">{row.status === "active" ? "下架" : "上架"}</GhostButton>
                        <GhostButton onClick={() => remove(row.id)} className="px-2.5 py-1.5">刪除</GhostButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
      </Card>

      {modalMode ? (
        <div className="fixed inset-0 z-50 bg-[rgba(21,14,5,0.42)] backdrop-blur-[2px] p-4 md:p-8">
          <div className="mx-auto h-full max-w-[1480px] rounded-[30px] border border-[rgba(184,155,94,0.26)] bg-[rgba(248,244,236,0.98)] shadow-[0_24px_80px_rgba(45,30,10,0.2)] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[rgba(184,155,94,0.2)] flex items-center justify-between">
              <div>
                <h3 className="font-serif-tc text-[24px] tracking-[0.12em] text-[rgba(52,38,17,0.95)]">
                  {modalMode === "create" ? "新增結緣品" : modalMode === "edit" ? "編輯結緣品" : "查看結緣品詳情"}
                </h3>
                <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.7)] mt-1">左側編輯，右側即時預覽前端詳情頁效果</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.72)]">欄位完成度</p>
                  <p className="text-sm tracking-[0.08em] text-[rgba(86,63,30,0.92)]">{completion.done}/{completion.total}（{completion.percentage}%）</p>
                </div>
                <GhostButton onClick={closeModal}>關閉</GhostButton>
              </div>
            </div>

            <div className="px-6 pt-4 pb-2 border-b border-[rgba(184,155,94,0.2)] flex flex-wrap gap-2">
              {tabs.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className="px-4 py-2 rounded-full text-sm tracking-[0.08em] border"
                  style={{
                    borderColor: index === activeTab ? "rgba(184,155,94,0.5)" : "rgba(184,155,94,0.22)",
                    background: index === activeTab ? "rgba(239,231,215,0.92)" : "rgba(247,242,232,0.55)",
                    color: "rgba(86,63,30,0.9)",
                  }}
                >
                  {`Tab ${index + 1}：${label}`}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="grid h-full grid-cols-1 xl:grid-cols-2">
                <div className="h-full overflow-y-auto border-r border-[rgba(184,155,94,0.2)] p-6 space-y-4">
                  {activeTab === 0 ? (
                    <>
                      <FieldBlock label="商品名稱" required error={errors.name}>
                        <Input disabled={readOnly} value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} placeholder="例如：修持經文扇" />
                      </FieldBlock>

                      <FieldBlock label="商品分類" required error={undefined}>
                        <>
                          <Input disabled={readOnly} list="product-category-options" value={editing.category} onChange={(e) => setEditing((v) => ({ ...v, category: e.target.value }))} placeholder="例如：法物 / 香品 / 文具" />
                          <datalist id="product-category-options">
                            <option value="法物" />
                            <option value="香品" />
                            <option value="文具" />
                            <option value="光之能貼片系列" />
                            <option value="七輪平衡・光能守護" />
                          </datalist>
                        </>
                      </FieldBlock>

                      <FieldBlock label="商品副標 / 一句核心文案" required error={errors.subtitle} helper={`${editing.subtitle.length}/80`}>
                        <Input disabled={readOnly} value={editing.subtitle} onChange={(e) => setEditing((v) => ({ ...v, subtitle: e.target.value }))} placeholder="例如：一開一合之間，讓心回到清明。" />
                      </FieldBlock>

                      <FieldBlock label="商品簡介" required error={errors.shortDescription} helper={`${editing.shortDescription.length}/120`}>
                        <div className="space-y-2">
                          <TextArea disabled={readOnly} rows={3} value={editing.shortDescription} onChange={(e) => setEditing((v) => ({ ...v, shortDescription: e.target.value }))} placeholder="一句可快速理解商品精神的介紹" />
                          {!readOnly ? (
                            <div className="flex justify-end">
                              <GhostButton
                                type="button"
                                onClick={() => {
                                  const fromDescription = editing.description
                                    .split(/[。！？]/)
                                    .find((x) => x.trim().length > 0)
                                    ?.trim() || "";
                                  if (!fromDescription) return;
                                  setEditing((v) => ({ ...v, shortDescription: fromDescription.length > 38 ? `${fromDescription.slice(0, 38)}…` : fromDescription }));
                                }}
                              >
                                由詳述自動帶入
                              </GhostButton>
                            </div>
                          ) : null}
                        </div>
                      </FieldBlock>

                      <FieldBlock label="此法物的意涵（詳述）" error={errors.description}>
                        <TextArea disabled={readOnly} rows={5} value={editing.description} onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))} placeholder="完整描述此法物與使用感受" />
                      </FieldBlock>

                      {readOnly ? (
                        <div className="space-y-2 rounded-xl border border-[rgba(138,109,65,0.18)] bg-[rgba(255,255,255,0.72)] p-3">
                          <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.6)]">商品圖片（唯讀）</p>
                          <p className="text-xs text-[rgba(90,70,35,0.7)] break-all">{editing.imageUrl || "未設定，將使用自性光林 placeholder"}</p>
                          <div className="relative h-28 overflow-hidden rounded-lg border border-[rgba(138,109,65,0.2)] bg-[rgba(248,244,236,0.75)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={editing.imageUrl || "/placeholder-image.svg"} alt="preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      ) : (
                        <ImageUploadField
                          value={editing.imageUrl}
                          onChange={(value) => setEditing((v) => ({ ...v, imageUrl: value }))}
                          onError={(msg) => setErrors((prev) => ({ ...prev, imageUrl: msg }))}
                          uploadFolder="products"
                          label="商品圖片（網址 / 上傳 / 清除）"
                        />
                      )}
                      <FieldError text={errors.imageUrl} />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FieldBlock label="護持功德金（NT$）" error={errors.meritAmount}>
                          <Input
                            disabled={readOnly}
                            type="number"
                            value={editing.meritAmount}
                            onChange={(e) => {
                              const meritAmount = Number(e.target.value);
                              setEditing((v) => ({ ...v, meritAmount, meritPrice: meritAmount, price: meritAmount }));
                            }}
                          />
                        </FieldBlock>
                        <FieldBlock label="庫存數量" error={errors.stock}>
                          <div className="space-y-2">
                            <Input disabled={readOnly} type="number" value={editing.stock} onChange={(e) => setEditing((v) => ({ ...v, stock: Number(e.target.value) }))} />
                            {!readOnly ? (
                              <div className="flex gap-2">
                                <GhostButton type="button" onClick={() => setEditing((v) => ({ ...v, stock: 0 }))}>設為 0</GhostButton>
                                <GhostButton type="button" onClick={() => setEditing((v) => ({ ...v, stock: v.stock + 10 }))}>+10</GhostButton>
                              </div>
                            ) : null}
                          </div>
                        </FieldBlock>
                        <FieldBlock label="上架狀態" error={undefined}>
                          <Select disabled={readOnly} value={editing.status} onChange={(e) => setEditing((v) => ({ ...v, status: e.target.value as ProductStatus }))}>
                            <option value="active">上架中</option>
                            <option value="inactive">已下架</option>
                            <option value="sold_out">完售</option>
                          </Select>
                        </FieldBlock>
                      </div>
                    </>
                  ) : null}

                  {activeTab === 1 ? (
                    <>
                      <FieldBlock label="此法物的意涵" error={errors.meaning}>
                        <TextArea disabled={readOnly} rows={5} value={editing.meaning} onChange={(e) => setEditing((v) => ({ ...v, meaning: e.target.value }))} />
                      </FieldBlock>
                      <FieldBlock label="修行意義 / 修行提醒" error={errors.practiceMeaning}>
                        <TextArea disabled={readOnly} rows={5} value={editing.practiceMeaning} onChange={(e) => setEditing((v) => ({ ...v, practiceMeaning: e.target.value }))} />
                      </FieldBlock>
                      <FieldBlock label="今日觀照" error={errors.contemplation}>
                        <TextArea disabled={readOnly} rows={5} value={editing.contemplation} onChange={(e) => setEditing((v) => ({ ...v, contemplation: e.target.value }))} />
                      </FieldBlock>
                      <FieldBlock label="此法物流轉的善念" error={errors.dedicationText}>
                        <TextArea disabled={readOnly} rows={5} value={editing.dedicationText} onChange={(e) => setEditing((v) => ({ ...v, dedicationText: e.target.value }))} />
                      </FieldBlock>
                    </>
                  ) : null}

                  {activeTab === 2 ? (
                    <>
                      <TagEditor
                        title="心境標籤"
                        hint="例如：安定、覺察、智慧、療癒"
                        quickOptions={quickMoodTags}
                        values={editing.moodTags}
                        inputValue={chipInput.moodTags}
                        error={errors.moodTags}
                        disabled={readOnly}
                        onInputChange={(value) => setChipInput((prev) => ({ ...prev, moodTags: value }))}
                        onAdd={() => addItem("moodTags")}
                        onAddDirect={(value) => addItemDirect("moodTags", value)}
                        onRemove={(value) => removeItem("moodTags", value)}
                      />

                      <TagEditor
                        title="適合使用情境"
                        hint="例如：晨起靜坐、書寫祈願、睡前安定"
                        quickOptions={quickUseCases}
                        values={editing.useCases}
                        inputValue={chipInput.useCases}
                        error={errors.useCases}
                        disabled={readOnly}
                        onInputChange={(value) => setChipInput((prev) => ({ ...prev, useCases: value }))}
                        onAdd={() => addItem("useCases")}
                        onAddDirect={(value) => addItemDirect("useCases", value)}
                        onRemove={(value) => removeItem("useCases", value)}
                      />

                      <div className="space-y-1.5">
                        <FieldLabel>修持方式（可新增 / 刪除 / 拖曳排序）</FieldLabel>
                        {!readOnly ? (
                          <div className="flex justify-end">
                            <GhostButton type="button" onClick={() => setEditing((prev) => ({ ...prev, practiceSteps: quickPracticeTemplate }))}>帶入四步修持範本</GhostButton>
                          </div>
                        ) : null}
                        <div className="space-y-2 rounded-xl border border-[rgba(138,109,65,0.2)] bg-white/60 p-3">
                          {editing.practiceSteps.map((step, index) => (
                            <div
                              key={`${index}-${step}`}
                              draggable={!readOnly}
                              onDragStart={() => setDragStepIndex(index)}
                              onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()}
                              onDrop={() => onStepDrop(index)}
                              className="flex items-center gap-2 rounded-lg border border-[rgba(138,109,65,0.18)] bg-white px-2 py-2"
                            >
                              <span className="w-6 text-center text-xs text-[rgba(90,70,35,0.7)]">{index + 1}</span>
                              <Input
                                disabled={readOnly}
                                value={step}
                                onChange={(e) => updateStep(index, e.target.value)}
                                placeholder="輸入這個步驟的內容"
                              />
                              {!readOnly ? <GhostButton type="button" onClick={() => removeStep(index)}>刪除</GhostButton> : null}
                            </div>
                          ))}
                          {!readOnly ? <GhostButton type="button" onClick={addStep}>新增步驟</GhostButton> : null}
                        </div>
                        <FieldError text={errors.practiceSteps} />
                      </div>

                      <div className="space-y-2 rounded-xl border border-[rgba(138,109,65,0.2)] bg-white/60 p-4">
                        <FieldLabel>能量屬性（1～5）</FieldLabel>
                        <div className="space-y-3 mt-1">
                          {energyMeta.map((item) => (
                            <div key={item.key} className="flex items-center justify-between gap-3">
                              <span className="w-14 text-sm tracking-[0.08em] text-[rgba(90,70,35,0.85)]">{item.label}</span>
                              <div className="flex gap-1.5">
                                {Array.from({ length: 5 }, (_, idx) => idx + 1).map((score) => (
                                  <button
                                    key={score}
                                    type="button"
                                    disabled={readOnly}
                                    onClick={() => setEnergy(item.key, score)}
                                    className="h-6 w-6 rounded-full border transition"
                                    style={{
                                      borderColor: "rgba(184,155,94,0.35)",
                                      background:
                                        score <= editing.energyAttributes[item.key]
                                          ? "rgba(184,155,94,0.68)"
                                          : "rgba(184,155,94,0.18)",
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <FieldError text={errors.energyAttributes} />
                      </div>
                    </>
                  ) : null}

                  {activeTab === 3 ? (
                    <>
                      <div className="space-y-1.5">
                        <FieldLabel>搜尋商品加入「與此法物同行」</FieldLabel>
                        <Input disabled={readOnly} value={relatedKeyword} onChange={(e) => setRelatedKeyword(e.target.value)} placeholder="輸入商品名稱或分類" />
                      </div>

                      <div className="rounded-xl border border-[rgba(138,109,65,0.2)] bg-white/60 p-3 max-h-[420px] overflow-y-auto space-y-2">
                        {relatedCandidates.map((item) => {
                          const checked = editing.relatedProductIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={readOnly}
                              onClick={() => toggleRelated(item.id)}
                              className="w-full rounded-lg border px-3 py-2 text-left"
                              style={{
                                borderColor: checked ? "rgba(184,155,94,0.5)" : "rgba(138,109,65,0.2)",
                                background: checked ? "rgba(239,231,215,0.86)" : "rgba(255,255,255,0.8)",
                              }}
                            >
                              <p className="text-sm font-medium text-[rgba(52,38,17,0.95)]">{item.name}</p>
                              <p className="text-xs text-[rgba(90,70,35,0.7)] mt-1">{item.category}</p>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : null}

                  {message ? <p className="text-sm text-[rgba(150,60,35,0.9)]">{message}</p> : null}
                </div>

                <div className="h-full overflow-y-auto p-6 bg-[rgba(247,242,232,0.5)]">
                  <div className="mx-auto max-w-[620px] space-y-6">
                    <div className="rounded-[26px] border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.88)] overflow-hidden">
                      <div className="relative h-[320px] bg-[rgba(239,231,215,0.55)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editing.imageUrl || "/placeholder-image.svg"} alt={editing.name || "placeholder"} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(35,24,8,0.16)] to-transparent" />
                      </div>
                      <div className="p-5">
                        <p className="text-xs tracking-[0.12em] text-[rgba(90,70,35,0.65)]">{editing.category || "法物"}</p>
                        <h3 className="mt-2 font-serif-tc text-3xl tracking-[0.12em] text-[rgba(56,44,29,0.92)]">{editing.name || "商品名稱"}</h3>
                        <p className="mt-2 text-[14px] leading-7 tracking-[0.08em] text-[rgba(122,104,82,0.82)]">{editing.subtitle || "一句核心文案會顯示在這裡"}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {editing.moodTags.length ? editing.moodTags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] tracking-[0.08em] border border-[rgba(184,155,94,0.24)] bg-[rgba(239,231,215,0.82)] text-[rgba(122,104,82,0.82)]">#{tag}</span>
                          )) : <span className="text-xs text-[rgba(122,104,82,0.7)]">尚未設定心境標籤</span>}
                        </div>
                        <p className="mt-4 text-xs tracking-[0.2em] text-[rgba(122,104,82,0.65)]">護持功德金</p>
                        <p className="mt-1 font-serif-tc text-3xl tracking-[0.08em] text-[rgba(86,63,30,0.92)]">NT${editing.meritAmount || 0}</p>
                      </div>
                    </div>

                    <PreviewSection title="此法物的意涵" content={editing.meaning || editing.description || "請輸入法物意涵內容"} />
                    <PreviewSection title="修行意義" content={editing.practiceMeaning || "請輸入修行意義內容"} />

                    <section className="rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.86)] p-5">
                      <h4 className="font-serif-tc text-[21px] tracking-[0.12em] text-[rgba(86,63,30,0.92)]">修持方式</h4>
                      <div className="mt-4 space-y-2">
                        {editing.practiceSteps.length ? editing.practiceSteps.map((step, idx) => (
                          <div key={`${idx}-${step}`} className="flex items-start gap-2">
                            <span className="mt-1 h-5 w-5 rounded-full border border-[rgba(184,155,94,0.35)] bg-[rgba(239,231,215,0.82)] text-[11px] text-[rgba(90,70,35,0.82)] flex items-center justify-center">{idx + 1}</span>
                            <p className="text-[14px] leading-7 tracking-[0.08em] text-[rgba(122,104,82,0.86)]">{step}</p>
                          </div>
                        )) : <p className="text-sm text-[rgba(122,104,82,0.72)]">尚未新增修持步驟</p>}
                      </div>
                    </section>

                    <PreviewSection title="今日觀照" content={editing.contemplation || "請輸入今日觀照"} />

                    <section className="rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.86)] p-5">
                      <h4 className="font-serif-tc text-[21px] tracking-[0.12em] text-[rgba(86,63,30,0.92)]">能量屬性</h4>
                      <div className="mt-4 space-y-2.5">
                        {energyMeta.map((item) => (
                          <div key={item.key} className="flex items-center gap-3">
                            <span className="w-12 text-[13px] tracking-[0.08em] text-[rgba(122,104,82,0.85)]">{item.label}</span>
                            <div className="flex gap-1.5">
                              {Array.from({ length: 5 }, (_, idx) => (
                                <span key={idx} className="h-2.5 w-8 rounded-full" style={{ background: idx < editing.energyAttributes[item.key] ? "rgba(184,155,94,0.68)" : "rgba(184,155,94,0.2)" }} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.86)] p-5">
                      <h4 className="font-serif-tc text-[21px] tracking-[0.12em] text-[rgba(86,63,30,0.92)]">與此法物同行</h4>
                      <div className="mt-4 space-y-2">
                        {previewRelated.length ? previewRelated.map((item) => (
                          <p key={item.id} className="text-sm text-[rgba(122,104,82,0.85)]">• {item.name}</p>
                        )) : <p className="text-sm text-[rgba(122,104,82,0.72)]">尚未選擇關聯商品</p>}
                      </div>
                    </section>

                    <PreviewSection title="此法物流轉的善念" content={editing.dedicationText || "請輸入善念回向文案"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[rgba(184,155,94,0.2)] flex items-center justify-between">
              <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.7)]">前端詳情頁內容由此資料完全驅動，不再使用寫死文案。</p>
              <div className="flex items-center gap-2">
                <GhostButton onClick={closeModal}>取消</GhostButton>
                {!readOnly ? <PrimaryButton onClick={save}>儲存商品</PrimaryButton> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FieldError({ text }: { text?: string }) {
  return text ? <p className="text-xs text-[rgba(150,60,35,0.9)] -mt-1">{text}</p> : null;
}

function FieldBlock({
  label,
  required,
  helper,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>
          {label}
          {required ? <span className="ml-1 text-[rgba(150,60,35,0.9)]">*</span> : null}
        </FieldLabel>
        {helper ? <span className="text-[11px] tracking-[0.06em] text-[rgba(122,104,82,0.72)]">{helper}</span> : null}
      </div>
      {children}
      <FieldError text={error} />
    </div>
  );
}

function TagEditor({
  title,
  hint,
  quickOptions,
  values,
  inputValue,
  disabled,
  error,
  onInputChange,
  onAdd,
  onAddDirect,
  onRemove,
}: {
  title: string;
  hint: string;
  quickOptions: string[];
  values: string[];
  inputValue: string;
  disabled: boolean;
  error?: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onAddDirect: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{title}</FieldLabel>
      <p className="text-xs text-[rgba(90,70,35,0.64)]">{hint}</p>
      <div className="flex gap-2">
        <Input
          disabled={disabled}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        {!disabled ? <GhostButton type="button" onClick={onAdd}>新增</GhostButton> : null}
      </div>
      {!disabled ? (
        <div className="flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAddDirect(option)}
              className="px-2.5 py-1 rounded-full text-[11px] tracking-[0.08em] border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.8)] text-[rgba(122,104,82,0.82)]"
            >
              + {option}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2 rounded-xl border border-[rgba(138,109,65,0.2)] bg-white/60 p-3 min-h-[52px]">
        {values.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full border border-[rgba(184,155,94,0.3)] bg-[rgba(239,231,215,0.82)] px-2.5 py-1 text-xs tracking-[0.08em] text-[rgba(90,70,35,0.84)]">
            {item}
            {!disabled ? <button type="button" onClick={() => onRemove(item)}>×</button> : null}
          </span>
        ))}
      </div>
      <FieldError text={error} />
    </div>
  );
}

function PreviewSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.86)] p-5">
      <h4 className="font-serif-tc text-[21px] tracking-[0.12em] text-[rgba(86,63,30,0.92)]">{title}</h4>
      <p className="mt-3 text-[14px] leading-8 tracking-[0.08em] text-[rgba(122,104,82,0.84)] whitespace-pre-line">{content}</p>
    </section>
  );
}
