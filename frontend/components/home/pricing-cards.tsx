'use client';

import { Button } from '@/components/ui/button';

interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  currency?: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    subtitle: 'Perfect for small institutions',
    price: '49K',
    currency: '₦',
    period: '/month',
    description: 'Get started with essential features',
    features: ['Up to 500 students', 'Basic school management', 'Financial tracking'],
    cta: 'Get Started',
  },
  {
    name: 'Professional',
    subtitle: 'Best for most institutions',
    price: '99K',
    currency: '₦',
    period: '/month',
    highlighted: true,
    description: 'Full-featured management system',
    features: ['Up to 1500 students', 'Full school + farm management', 'Advanced analytics'],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    subtitle: 'For large institutions',
    price: 'Custom',
    period: '',
    description: 'Unlimited users and custom features',
    features: ['Unlimited users', 'Custom features', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`p-8 rounded-xl border transition-all ${
            plan.highlighted
              ? 'border-2 border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          {plan.highlighted && (
            <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
              Popular
            </div>
          )}
          <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
          <p className="text-muted-foreground mb-4">{plan.subtitle}</p>
          <div className="mb-6">
            {plan.currency && <span className="text-4xl font-bold text-foreground">{plan.currency}</span>}
            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            variant={plan.highlighted ? 'default' : 'outline'}
            className="w-full"
          >
            {plan.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}
