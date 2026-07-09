'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              360
            </div>
            <span className="font-bold text-lg text-foreground">EE360</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-screen flex items-center justify-center">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Carousel className="w-full h-full" setApi={setApi}>
            <CarouselContent className="w-full h-full m-0">
              <CarouselItem className="w-full h-full basis-full">
                <div className="relative w-full h-screen">
                  <Image
                    src="/EE1.JPG"
                    alt="EE360 Platform Demo 1"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="w-full h-full basis-full">
                <div className="relative w-full h-screen">
                  <Image
                    src="/EE2.png"
                    alt="EE360 Platform Demo 2"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12" />
          </Carousel>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-5" />
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              Unified Management for Schools & Farms
            </h1>
            <p className="text-xl text-white/90 mb-8 text-balance">
              A smart, all-in-one platform designed to streamline farm and school management through technology. It integrates operations, data, and analytics to improve productivity, efficiency, and decision-making—empowering users to manage resources, track performance, and drive sustainable growth with ease.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
