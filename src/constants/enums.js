// src/constants/enum.js

// User and Role
export const UserRole = Object.freeze({
  Admin: "admin",
  Owner: "owner",
  Staff: "staff",
  Client: "client",
});

export const UserStatus = Object.freeze({
  Active: "active",
  Inactive: "inactive",
  Suspended: "suspended",
});

// Brand, Store, Floor, Room, Machine
export const BrandStatus = Object.freeze({
  Active: "active",
  Inactive: "inactive",
});

export const StoreStatus = Object.freeze({
  Active: "active",
  Inactive: "inactive",
});

export const FloorStatus = Object.freeze({
  Active: "active",
  Inactive: "inactive",
  Hidden: "hidden",
});

export const RoomStatus = Object.freeze({
  Active: "active",
  Maintenance: "maintenance",
  Hidden: "hidden",
});

export const RoomType = Object.freeze({
  Normal: "normal",
  Vip: "vip",
  Streaming: "streaming",
});

export const MachineStatus = Object.freeze({
  Available: "available",
  Busy: "busy",
  Down: "down",
  Maintenance: "maintenance",
});

export const PricingStatus = Object.freeze({
  Active: "Active",
  Inactive: "Inactive",
});

// Booking
export const BookingStatus = Object.freeze({
  Reserved: "reserved",
  CheckedIn: "checked_in",
  Completed: "completed",
  Cancelled: "cancelled",
  NoShow: "no_show",
});

// Order
export const OrderStatus = Object.freeze({
  Pending: "pending",
  Preparing: "preparing",
  Delivering: "delivering",
  Done: "done",
  Cancelled: "cancelled",
});

// Invoice and Payment
export const InvoiceStatus = Object.freeze({
  Open: "open",
  Paid: "paid",
  Void: "void",
});

export const PaymentMethod = Object.freeze({
  Cash: "cash",
  Card: "card",
  Qr: "qr",
  Wallet: "wallet",
});

export const PaymentStatus = Object.freeze({
  Pending: "pending",
  Captured: "captured",
  Failed: "failed",
  Refunded: "refunded",
});

// Review and Rating
export const ReviewVisibility = Object.freeze({
  Public: "public",
  Hidden: "hidden",
});

export const ReviewStatus = Object.freeze({
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
});

// Issue and Ticketing
export const IssueScope = Object.freeze({
  Store: "store",
  System: "system",
});

export const IssueCategory = Object.freeze({
  Machine: "machine",
  Room: "room",
  Billing: "billing",
  Booking: "booking",
  Food: "food",
  Other: "other",
});

export const IssuePriority = Object.freeze({
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
});

export const IssueStatus = Object.freeze({
  Open: "open",
  InProgress: "in_progress",
  Resolved: "resolved",
  Closed: "closed",
  Rejected: "rejected",
});

// Chat and Notification
export const MessageType = Object.freeze({
  Text: "text",
  System: "system",
  Alert: "alert",
});

export const MessageStatus = Object.freeze({
  Sent: "sent",
  Delivered: "delivered",
  Read: "read",
});

export const NotificationType = Object.freeze({
  System: "system",
  Booking: "booking",
  Order: "order",
  Payment: "payment",
  Issue: "issue",
});

export const NotificationChannel = Object.freeze({
  InApp: "inapp",
  Email: "email",
  Sms: "sms",
  Push: "push",
});

export const NotificationStatus = Object.freeze({
  Queued: "queued",
  Sending: "sending",
  Sent: "sent",
  Failed: "failed",
  Read: "read",
});

export const Gender = Object.freeze({
  Male: "male",
  Female: "female",
  Other: "other",
});

export const VoucherStatus = Object.freeze({
  Active: "Active",
  Inactive: "Inactive",
  Expired: "Expired",
});
