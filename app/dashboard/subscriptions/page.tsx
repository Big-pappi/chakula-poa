"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { plans, subscriptions } from "@/lib/api";
import { useRouter } from "next/navigation"; // Import router from next/navigation
import type { SubscriptionPlan, Subscription } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CreditCard,
  Calendar,
  Clock,
  Utensils,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter(); // Declare router variable
  const [plansList, setPlansList] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          plans.getAll(),
          subscriptions.getCurrent(),
        ]);
        if (plansRes.data) setPlansList(plansRes.data);
        if (subRes.data) setCurrentSubscription(subRes.data);
      } catch {
        // Demo data
        setPlansList([
          {
            id: "1",
            name: "Weekly Plan",
            duration_days: 7,
            price: 14000,
            meals_per_day: 3,
            description: "Perfect for trying out the service",
          },
          {
            id: "2",
            name: "Monthly Plan",
            duration_days: 30,
            price: 50000,
            meals_per_day: 3,
            description: "Best value for regular students",
          },
          {
            id: "3",
            name: "Semester Plan",
            duration_days: 120,
            price: 180000,
            meals_per_day: 3,
            description: "Maximum savings for the full semester",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (planId: string) => {
    // Redirect to payment page with selected plan
    router.push(`/dashboard/payment?plan=${planId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Subscription Plans
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Choose a meal plan that fits your needs
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && currentSubscription.status === "active" && (
        <Card className="mb-6 sm:mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">
                    Current Plan
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {currentSubscription.plan_name}
                  </CardDescription>
                </div>
              </div>
              <Badge className="w-fit bg-green-500 hover:bg-green-500">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-background p-3 sm:p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    {new Date(currentSubscription.end_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-background p-3 sm:p-4">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Days Left</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    {getDaysRemaining(currentSubscription.end_date)} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-background p-3 sm:p-4">
                <Utensils className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Meals Left</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    {currentSubscription.meals_remaining} meals
                  </p>
                </div>
              </div>
            </div>
            {getDaysRemaining(currentSubscription.end_date) <= 7 && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm">
                  Your subscription expires soon. Renew now to avoid
                  interruption.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plansList.map((plan) => {
          const isCurrentPlan =
            currentSubscription?.plan_id === plan.id &&
            currentSubscription.status === "active";
          const pricePerDay = plan.price / plan.duration_days;
          const pricePerMeal = plan.price / (plan.duration_days * plan.meals_per_day);

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                plan.id === "2"
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              {plan.id === "2" && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1">
                  <span className="text-xs font-semibold text-primary-foreground">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">
                    {formatPrice(plan.price)}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {formatPrice(Math.round(pricePerDay))}/day
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {plan.duration_days} days of meals
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {plan.meals_per_day} meals per day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {formatPrice(Math.round(pricePerMeal))} per meal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Pre-order any meal 24hrs in advance
                    </span>
                  </div>
                </div>
                <Button
                  className="h-10 sm:h-12 w-full"
                  variant={plan.id === "2" ? "default" : "outline"}
                  disabled={isCurrentPlan || subscribing === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Methods */}
      <Card className="mt-6 sm:mt-8 border-border/50">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Payment Methods</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            We accept mobile money payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 sm:px-4 sm:py-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-red-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                M
              </div>
              <span className="text-xs sm:text-sm font-medium">M-Pesa</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 sm:px-4 sm:py-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-red-600 flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                A
              </div>
              <span className="text-xs sm:text-sm font-medium">Airtel Money</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 sm:px-4 sm:py-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-blue-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                T
              </div>
              <span className="text-xs sm:text-sm font-medium">Tigo Pesa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
