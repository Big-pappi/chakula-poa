/**
 * Chakula Poa API Endpoints
 * 
 * Maps to Django URLs from your urls.py:
 * - /api/users/          - Authentication & user management
 * - /api/universities/   - University listing
 * - /api/plans/          - Subscription plans
 * - /api/subscriptions/  - User subscriptions
 * - /api/meals/          - Meals & orders
 * - /api/payments/       - Payment processing
 * - /api/staff/          - Staff verification & serving
 * - /api/admin/          - Admin dashboard & reports
 * - /api/students/       - Student dashboard
 */

import { api, tokenManager } from "./client";
import type {
  User,
  University,
  SubscriptionPlan,
  Subscription,
  Meal,
  MealOrder,
  Transaction,
  AuthResponse,
  StudentDashboardStats,
  AdminDashboardStats,
  DemandReport,
  VerificationResponse,
} from "@/lib/types";

/**
 * Auth endpoints - /api/users/
 */
export const auth = {
  register: async (data: {
    first_name: string;
    last_name?: string;
    phone_number: string;
    email?: string;
    registration_number?: string;
    university?: string;
    password: string;
  }) => {
    const response = await api.post<AuthResponse>("/api/users/register/", data as Record<string, unknown>, {
      requiresAuth: false,
    });
    if (response.data) {
      tokenManager.setTokens(response.data.access, response.data.refresh);
    }
    return {
      ...response,
      data: response.data
        ? {
            token: response.data.access,
            cps_number: response.data.cps_number,
            user: response.data.user,
          }
        : undefined,
    };
  },

  login: async (data: { phone_number: string; password: string }) => {
    const response = await api.post<AuthResponse>("/api/users/login/", data as Record<string, unknown>, {
      requiresAuth: false,
    });
    if (response.data) {
      tokenManager.setTokens(response.data.access, response.data.refresh);
    }
    return {
      ...response,
      data: response.data
        ? {
            token: response.data.access,
            user: response.data.user,
          }
        : undefined,
    };
  },

  logout: () => {
    tokenManager.clearTokens();
    return api.post("/api/users/logout/", {});
  },

  me: () => api.get<User>("/api/users/me/"),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/api/users/me/", data as Record<string, unknown>),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post("/api/users/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    }),

  refreshToken: (refresh: string) =>
    api.post<{ access: string }>("/api/users/token/refresh/", { refresh }),
};

/**
 * Universities endpoints - /api/universities/
 */
export const universities = {
  getAll: () =>
    api.get<University[]>("/api/universities/", { requiresAuth: false }),
  getById: (id: string) =>
    api.get<University>(`/api/universities/${id}/`, { requiresAuth: false }),
};

/**
 * Subscription Plans endpoints - /api/plans/
 */
export const plans = {
  getAll: (universityId?: string) => {
    const query = universityId ? `?university_id=${universityId}` : "";
    return api.get<SubscriptionPlan[]>(`/api/plans/${query}`, {
      requiresAuth: false,
    });
  },
  getById: (id: string) =>
    api.get<SubscriptionPlan>(`/api/plans/${id}/`, { requiresAuth: false }),
};

/**
 * Subscriptions endpoints - /api/subscriptions/
 */
export const subscriptions = {
  getCurrent: () => api.get<Subscription>("/api/subscriptions/me/"),
  create: (planId: string) =>
    api.post<Subscription>("/api/subscriptions/", { plan_id: planId }),
  getHistory: () => api.get<Subscription[]>("/api/subscriptions/history/"),
  cancel: (id: string) => api.delete(`/api/subscriptions/${id}/`),
};

/**
 * Meals endpoints - /api/meals/
 */
export const meals = {
  getAvailable: (date?: string) => {
    const query = date ? `?date=${date}` : "";
    return api.get<Meal[]>(`/api/meals/${query}`);
  },
  getById: (id: string) => api.get<Meal>(`/api/meals/${id}/`),
  select: (mealId: string) =>
    api.post<MealOrder>("/api/meals/select/", { meal_id: mealId }),
  getOrders: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return api.get<MealOrder[]>(`/api/meals/orders/${query}`);
  },
  cancelOrder: (orderId: string) => api.delete(`/api/meals/orders/${orderId}/`),
};

/**
 * Payments endpoints - /api/payments/
 */
export const payments = {
  initiate: (data: {
    subscription_id: string;
    payment_method: string;
    phone_number: string;
  }) =>
    api.post<{ order_id: string; checkout_url?: string; message: string }>(
      "/api/payments/initiate/",
      data
    ),
  checkStatus: (paymentId: string) =>
    api.get<{ status: string; transaction_id?: string }>(
      `/api/payments/${paymentId}/status/`
    ),
  getHistory: () => api.get<Transaction[]>("/api/payments/history/"),
};

/**
 * Staff endpoints - /api/staff/
 */
export const staff = {
  verifyStudent: (cpsNumber?: string, qrCode?: string) =>
    api.post<VerificationResponse>("/api/staff/verify/", {
      cps_number: cpsNumber,
      qr_code: qrCode,
    }),
  serveMeal: (orderId: string) =>
    api.post<MealOrder>("/api/staff/serve/", { order_id: orderId }),
  getTodaysOrders: () => api.get<MealOrder[]>("/api/staff/orders/today/"),
  getStats: () =>
    api.get<{ served_today: number; pending_today: number }>(
      "/api/staff/stats/"
    ),
};

/**
 * Admin endpoints - /api/admin/
 */
export const admin = {
  getDashboardStats: () => api.get<AdminDashboardStats>("/api/admin/dashboard/"),

  // Meal management
  getMeals: (date?: string) => {
    const query = date ? `?date=${date}` : "";
    return api.get<Meal[]>(`/api/admin/meals/${query}`);
  },
  createMeal: (data: Partial<Meal>) =>
    api.post<Meal>("/api/admin/meals/", data as Record<string, unknown>),
  updateMeal: (id: string, data: Partial<Meal>) =>
    api.patch<Meal>(`/api/admin/meals/${id}/`, data as Record<string, unknown>),
  deleteMeal: (id: string) => api.delete(`/api/admin/meals/${id}/`),

  // Staff management
  getStaff: () => api.get<User[]>("/api/admin/staff/"),
  createStaff: (data: Partial<User> & { password: string }) =>
    api.post<User>("/api/admin/staff/", data as Record<string, unknown>),
  updateStaff: (id: string, data: Partial<User>) =>
    api.patch<User>(`/api/admin/staff/${id}/`, data as Record<string, unknown>),
  deleteStaff: (id: string) => api.delete(`/api/admin/staff/${id}/`),

  // Students
  getStudents: (params?: { search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return api.get<User[]>(`/api/admin/students/${query}`);
  },

  // Reports
  getDemandReport: (date?: string) => {
    const query = date ? `?date=${date}` : "";
    return api.get<DemandReport[]>(`/api/admin/reports/demand/${query}`);
  },
  getRevenueReport: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    return api.get<{ total: number; by_day: Record<string, number> }>(
      `/api/admin/reports/revenue/${query}`
    );
  },
};

/**
 * Student Dashboard - /api/students/
 */
export const studentDashboard = {
  getStats: () => api.get<StudentDashboardStats>("/api/students/dashboard/"),
};

/**
 * Super Admin endpoints (if needed)
 */
export const superAdmin = {
  getSystemStats: () => api.get("/api/admin/system/stats/"),
  getUniversities: () => api.get<University[]>("/api/admin/universities/"),
  createUniversity: (data: Partial<University>) =>
    api.post<University>("/api/admin/universities/", data as Record<string, unknown>),
  updateUniversity: (id: string, data: Partial<University>) =>
    api.patch<University>(`/api/admin/universities/${id}/`, data as Record<string, unknown>),
};
