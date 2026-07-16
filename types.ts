export type Role = 'ADMIN' | 'VERIFICATION_STAFF' | 'FINANCE_STAFF' | 'SUPPORT_STAFF' | 'EVENT_ORGANIZER' | 'SELLER' | 'BUYER';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESTRICTED';

export type PlanType = 'NONE' | 'STARTER' | 'PRO' | 'ELITE' | 'EXO_PASS';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: Role;
  name: string;
  avatar?: string;
  contact?: string;
  location?: string;
  barangay?: string;
  balance: number;
  status: UserStatus;
  idPhotoUrl?: string; // Standard ID
  kycSelfieUrl?: string; // Selfie with ID
  kycName?: string; // Legal name for match
  trustScore?: number;
  spentAmount?: number;
  plan: PlanType;
  denrPermit?: string; // DENR CWR/WFP
  denrVerified?: boolean;
  paymentMethods?: { bank: string, name: string, number: string }[];
  bio?: string;
  isBetaAuthorized?: boolean;
  animalCategory?: 'FEEDERS' | 'EXOTICS' | 'SUPPLIES'; // New
  faceIdConsent?: boolean; // New
  biometricId?: string; // New for biometrics
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: 'FEEDERS' | 'EXOTICS' | 'SUPPLIES';
  barangay?: string;
  province?: string;
  createdAt: string;
  reported?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = 'INQUIRY' | 'PENDING_PAYMENT' | 'PAYMENT_UPLOADED' | 'VERIFIED' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: OrderStatus;
  receiptUrl?: string;
  deliveryProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string; // Optional for general inquiry
  buyerId: string;
  sellerId: string;
  senderId: string;
  text: string;
  receiptUrl?: string;
  timestamp: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  mediaUrls: string[];
  isDefaultBanner?: boolean;
  createdAt: string;
}

export type PaymentRequestStatus = 'PENDING_VERIFIER' | 'PENDING_TREASURER' | 'VERIFIED_FUNDS' | 'ACTIVATED' | 'REJECTED';

export interface PaymentRequest {
  id: string;
  userId: string;
  amount: number;
  receiptUrl: string;
  transactionNumber?: string;
  accountNumber?: string;
  type: 'TOPUP' | 'SUBSCRIPTION' | 'EXO_PASS';
  planTarget?: PlanType;
  status: PaymentRequestStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  targetPath?: string; // Redirect path
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  userId: string;
  userName: string;
  userRole: string;
  type: string;
  amount: number;
  channel: string;
}

export interface Report {
  id: string;
  targetId: string;
  type: 'PRODUCT' | 'USER';
  reporterId: string;
  reason: string;
  status: 'PENDING' | 'REVIEWED';
  createdAt: string;
}

export interface AppConfig {
  gcashNumber: string;
  gcashName: string;
  gotymeNumber: string;
  gotymeName: string;
  dtiVerified: boolean;
}
