// Chakula Poa Type Definitions
// Based on Django backend models

export interface User {
  id: string;
  cps_number: string;
  full_name: string;
  email: string;
  phone_number: string;
  registration_number?: string;
  university_id?: string;
  university_name?: string;
  role: "student" | "staff" | "admin" | "super_admin" | "developer";
  is_active: boolean;
  qr_code_data?: string;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  code: string;
  location?: string;
  address?: string;
  city?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  university_id: string;
  name: string;
  duration_type: "day" | "week" | "month" | "semester";
  duration_days: number;
  price: number;
  meals_per_day: number;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan?: SubscriptionPlan;
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "expired" | "cancelled";
  remaining_meals: number;
  payment_reference?: string;
  created_at: string;
}

export interface Meal {
  id: string;
  university_id: string;
  name: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  description?: string;
  available_date: string;
  max_servings: number;
  current_orders: number;
  created_at: string;
}

export interface MealOrder {
  id: string;
  user_id: string;
  meal_id: string;
  meal?: Meal;
  subscription_id: string;
  order_date: string;
  status: "pending" | "confirmed" | "served" | "cancelled";
  served_at?: string;
  served_by?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_reference?: string;
  external_reference?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
  completed_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth Types
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  cps_number?: string;
}

export interface LoginCredentials {
  phone_number: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  phone_number: string;
  email?: string;
  registration_number?: string;
  university_id?: string;
  password: string;
}

// Dashboard Stats Types
export interface StudentDashboardStats {
  subscription: Subscription | null;
  remaining_meals: number;
  upcoming_orders: MealOrder[];
  recent_orders: MealOrder[];
}

export interface AdminDashboardStats {
  total_students: number;
  active_subscriptions: number;
  todays_orders: number;
  revenue_this_month: number;
  meal_demand_report: {
    meal_id: string;
    meal_name: string;
    orders: number;
  }[];
  recent_transactions: Transaction[];
}

export interface VerificationRequest {
  cps_number?: string;
  qr_code?: string;
}

export interface VerificationResponse {
  valid: boolean;
  student?: User;
  order?: MealOrder;
  message: string;
}

// Report Types
export interface DemandReport {
  meal_type: string;
  meal_name: string;
  total_orders: number;
  served: number;
  pending: number;
}

export interface RevenueReport {
  total_revenue: number;
  period: string;
  transactions_count: number;
  by_payment_method: { method: string; amount: number; count: number }[];
}
