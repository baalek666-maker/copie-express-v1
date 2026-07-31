import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
  typescript: true,
});

export const PLANS = {
  monthly: {
    name: 'Mensuel',
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    amount: 1000, // 10€ en centimes
    currency: 'eur',
  },
  yearly: {
    name: 'Annuel Standard',
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    amount: 9900, // 99€
    currency: 'eur',
  },
  expert_yearly: {
    name: 'Expert Bac/Brevet',
    priceId: process.env.STRIPE_PRICE_EXPERT!,
    amount: 14900, // 149€
    currency: 'eur',
  },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  planId: PlanId
) {
  const plan = PLANS[planId];
  return stripe.checkout.sessions.create({
    customer_email: userEmail,
    client_reference_id: userId,
    mode: 'subscription',
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
    metadata: { user_id: userId, plan_id: planId },
    subscription_data: {
      metadata: { user_id: userId, plan_id: planId },
    },
  });
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
  });
}