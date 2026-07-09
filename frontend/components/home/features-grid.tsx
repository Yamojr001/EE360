'use client';

import { Users, BookOpen, BarChart3, Tractor, Zap, Award } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}

const features: Feature[] = [
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'School Management',
    description: 'Comprehensive student and staff management systems',
    items: ['Student registrations', 'Staff directory', 'Daily attendance'],
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: 'Academic Management',
    description: 'Complete academic operations and tracking',
    items: ['Assignment tracking', 'Exam management', 'Grade recording'],
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: 'Financial Management',
    description: 'Streamlined financial operations and reporting',
    items: ['Fee tracking', 'Payroll management', 'Financial reports'],
  },
  {
    icon: <Tractor className="w-6 h-6 text-primary" />,
    title: 'Farm Operations',
    description: 'Integrated farm management and tracking',
    items: ['Crop planning', 'Livestock tracking', 'Inventory control'],
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: 'Analytics & Insights',
    description: 'Real-time dashboards and comprehensive reporting',
    items: ['Live dashboards', 'PDF reports', 'Trend analysis'],
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: 'Enterprise Ready',
    description: 'Built for scale and reliability',
    items: ['Multiple institutions', 'Offline support', 'Low-bandwidth friendly'],
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group p-8 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
          <p className="text-muted-foreground mb-4">{feature.description}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {feature.items.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
