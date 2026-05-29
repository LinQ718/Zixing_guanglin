export type ProductStatus = "active" | "inactive" | "sold_out";

export type ProductEnergyAttributes = {
  stability: number;
  wisdom: number;
  focus: number;
  healing: number;
  balance: number;
};

export type LanternSeaItem = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  imageUrl: string;
  price: number;
  meritPrice?: number;
  stock: number;
  status: ProductStatus;
  category: string;
  moodTags?: string[];
  useCases?: string[];
  meaning?: string;
  practiceMeaning?: string;
  practiceSteps?: string[];
  contemplation?: string;
  energyAttributes?: ProductEnergyAttributes;
  relatedProductIds?: string[];
  dedicationText?: string;
  createdAt: string;
  updatedAt: string;
  meritAmount?: number;
};

export type CourseStatus = "active" | "inactive";

export type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  teacher: string;
  maxStudents: number;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  signups?: number;
  category?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "member";
  createdAt: string;
  level?: "一般會員" | "護持會員" | "常住志工";
  joinedAt?: string;
};

export type PracticeLogStatus = "done" | "in_progress" | "pending";

export type PracticeLog = {
  id: string;
  memberId: string;
  title: string;
  content: string;
  date: string;
  status: PracticeLogStatus;
  createdAt: string;
  level?: "一般會員" | "護持會員" | "常住志工";
  memberName?: string;
  practiceType?: string;
  courseName?: string;
  reflection?: string;
};

export type NotificationStatus = "draft" | "published" | "hidden";

export type Notice = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  link: string;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
  linkUrl?: string;
};

export type DashboardMetrics = {
  totalProducts: number;
  lowStockProducts: number;
  publishedCourses: number;
  totalMembers: number;
  latestLogs: PracticeLog[];
  latestNotices: Notice[];
};

export type MemberFilter = {
  keyword?: string;
};

export type PracticeLogFilter = {
  keyword?: string;
  date?: string;
  memberId?: string;
  courseName?: string;
};
