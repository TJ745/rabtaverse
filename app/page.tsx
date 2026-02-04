import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Globe,
  MessageCircle,
  Shield,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-8">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white ">
            Rabta<span className="text-zinc-600">Verse</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed">
            A next‑generation chat universe built for speed, privacy, and
            real‑time connection. One platform. Endless conversations.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4">
            <Benefit icon={<Zap className="w-5 h-5" />} title="Ultra Fast" />
            <Benefit
              icon={<Shield className="w-5 h-5" />}
              title="Secure & Private"
            />
            <Benefit
              icon={<Globe className="w-5 h-5" />}
              title="Global Reach"
            />
            <Benefit
              icon={<Smartphone className="w-5 h-5" />}
              title="Mobile Ready"
            />
          </div>

          <div className="flex gap-4 pt-2 items-center justify-center">
            <Link href="/login">
              <Button size="lg" variant="outline" className="cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="cursor-pointer">
                Sign Up for free <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <ImageCarousel />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-4 gap-6 ">
        <FeatureCard
          icon={<MessageCircle className="w-6 h-6" />}
          title="Realtime Chat"
          desc="Instant messaging with typing indicators and read receipts."
        />
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="Groups & Communities"
          desc="Create public or private groups and manage communities."
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6" />}
          title="End‑to‑End Security"
          desc="Built with modern auth and encrypted messaging flows."
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Lightning Speed"
          desc="Optimized APIs and realtime sockets for zero lag."
        />
      </div>
    </main>
  );
}

function Benefit({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-zinc-200">
      <div className="p-2 rounded-xltext-white">{icon}</div>
      <span>{title}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition bg-linear-to-b from-black via-zinc-950 to-black text-white">
      <CardContent className="p-5 space-y-2">
        <div className="p-2 w-fit rounded-xltext-white">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-zinc-400">{desc}</p>
      </CardContent>
    </Card>
  );
}

function ImageCarousel() {
  const images = ["/images/homepage/Web.png", "/images/homepage/Mobile.png"];

  return (
    <div className="relative w-full h-100 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950">
      <div className="flex w-full h-full animate-carousel">
        {images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt={`Rabtaverse UI ${i + 1}`}
            className="object-contain shrink-0 p-4"
            width={1200}
            height={1200}
          />
        ))}
      </div>

      {/* subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-black/40" />
    </div>
  );
}
