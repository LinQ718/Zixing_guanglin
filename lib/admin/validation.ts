type ErrorMap<T extends string = string> = Partial<Record<T, string>>;

const isImageUrl = (url: string) => {
  if (!url.trim()) return false;
  if (url.startsWith("blob:") || url.startsWith("data:image/")) return true;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
};

export function validateProductForm(input: {
  name: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  meaning?: string;
  practiceMeaning?: string;
  contemplation?: string;
  dedicationText?: string;
  imageUrl: string;
  meritAmount: number;
  stock: number;
  moodTags?: string[];
  useCases?: string[];
  practiceSteps?: string[];
  energyAttributes?: {
    stability: number;
    wisdom: number;
    focus: number;
    healing: number;
    balance: number;
  };
}) {
  const errors: ErrorMap<
    | "name"
    | "subtitle"
    | "shortDescription"
    | "description"
    | "meaning"
    | "practiceMeaning"
    | "contemplation"
    | "dedicationText"
    | "imageUrl"
    | "meritAmount"
    | "stock"
    | "moodTags"
    | "useCases"
    | "practiceSteps"
    | "energyAttributes"
  > = {};
  if (!input.name.trim()) errors.name = "請填寫商品名稱";
  if (input.subtitle && input.subtitle.trim().length > 80) errors.subtitle = "副標建議 80 字以內";
  if (!input.shortDescription?.trim()) errors.shortDescription = "請填寫商品簡介";
  if (input.shortDescription && input.shortDescription.trim().length < 12) errors.shortDescription = "商品簡介至少 12 字";
  if (input.description.trim().length < 12) errors.description = "介紹至少 12 字";
  if (!input.meaning?.trim()) errors.meaning = "請填寫此法物的意涵";
  if (!input.practiceMeaning?.trim()) errors.practiceMeaning = "請填寫修行意義";
  if (!input.contemplation?.trim()) errors.contemplation = "請填寫今日觀照";
  if (!input.dedicationText?.trim()) errors.dedicationText = "請填寫善念回向文案";
  if (input.imageUrl.trim() && !isImageUrl(input.imageUrl)) errors.imageUrl = "請提供有效圖片網址或上傳圖片";
  if (!Number.isFinite(input.meritAmount) || input.meritAmount <= 0) errors.meritAmount = "結緣金需大於 0";
  if (!Number.isInteger(input.stock) || input.stock < 0) errors.stock = "庫存需為 0 以上整數";
  if (!input.moodTags?.length) errors.moodTags = "請至少新增 1 個心境標籤";
  if (!input.useCases?.length) errors.useCases = "請至少新增 1 個適合情境";
  if (!input.practiceSteps?.length) errors.practiceSteps = "請至少新增 1 個修持步驟";

  const energy = input.energyAttributes;
  if (!energy) {
    errors.energyAttributes = "請設定能量屬性";
  } else {
    const values = [energy.stability, energy.wisdom, energy.focus, energy.healing, energy.balance];
    if (values.some((v) => !Number.isInteger(v) || v < 1 || v > 5)) {
      errors.energyAttributes = "能量屬性需為 1 到 5 的整數";
    }
  }

  return errors;
}

export function validateLanternSeaForm(input: {
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}) {
  const errors: ErrorMap<"title" | "description" | "imageUrl" | "sortOrder"> = {};
  if (!input.title.trim()) errors.title = "請填寫標題";
  if (input.description.trim().length < 10) errors.description = "介紹至少 10 字";
  if (!isImageUrl(input.imageUrl)) errors.imageUrl = "請提供有效圖片網址或上傳圖片";
  if (!Number.isInteger(input.sortOrder) || input.sortOrder <= 0) errors.sortOrder = "排序需為正整數";
  return errors;
}

export function validateCourseForm(input: {
  name: string;
  description: string;
  date: string;
  time: string;
  teacher: string;
  imageUrl: string;
  signups: number;
}) {
  const errors: ErrorMap<"name" | "description" | "date" | "time" | "teacher" | "imageUrl" | "signups"> = {};
  if (!input.name.trim()) errors.name = "請填寫課程名稱";
  if (input.description.trim().length < 10) errors.description = "課程介紹至少 10 字";
  if (!input.date) errors.date = "請選擇日期";
  if (!input.time) errors.time = "請選擇時間";
  if (!input.teacher.trim()) errors.teacher = "請填寫講師";
  if (!isImageUrl(input.imageUrl)) errors.imageUrl = "請提供有效圖片網址或上傳圖片";
  if (!Number.isInteger(input.signups) || input.signups < 0) errors.signups = "報名人數需為 0 以上整數";
  return errors;
}

export function validateNoticeForm(input: {
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
}) {
  const errors: ErrorMap<"title" | "content" | "imageUrl" | "linkUrl"> = {};
  if (!input.title.trim()) errors.title = "請填寫通知標題";
  if (input.content.trim().length < 8) errors.content = "通知內容至少 8 字";
  if (!isImageUrl(input.imageUrl)) errors.imageUrl = "請提供有效圖片網址或上傳圖片";
  if (input.linkUrl.trim()) {
    try {
      // Allow absolute URL or internal path.
      if (!input.linkUrl.startsWith("/")) new URL(input.linkUrl);
    } catch {
      errors.linkUrl = "連結格式不正確";
    }
  }
  return errors;
}

export function hasErrors<T extends string>(errors: Partial<Record<T, string>>) {
  return Object.values(errors).some(Boolean);
}
