import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GridBackground } from "@/components/ui/gridBackground";
import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const scaleHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

// Motion Button component for animations
const MotionButton = motion(Button);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface PricingCardProps {
  tier: string;
  price: string;
  features: string[];
  featured?: boolean;
}

interface FooterListProps {
  title: string;
  links: string[];
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-[#060c16]/80 backdrop-blur-xl border-b border-[#576CBC]/10 py-3"
        : "bg-transparent border-b border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="cursor-pointer group">
          <Logo
            iconClassName="bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_20px_rgba(165,215,232,0.2)] group-hover:scale-110 transition-transform"
            textClassName="text-white text-2xl tracking-tighter"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {["Features", "Solutions", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors relative group"
            >
              {item}
            </a>
          ))}
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <Link to="/login" className="hover:text-[#A5D7E8] transition-colors">
            Login
          </Link>
          <MotionButton
            {...scaleHover}
            className="bg-[#A5D7E8] text-[#0B2447] hover:bg-white rounded-full font-bold px-6 h-auto py-2.5 shadow-[0_0_20px_rgba(165,215,232,0.3)]"
          >
            <Link to="/signup">Get Started</Link>
          </MotionButton>
        </div>

        {/* Mobile Toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="bg-[#060c16] border-b border-[#576CBC]/20 w-full p-0"
          >
            <div className="flex flex-col p-6 gap-6">
              {["Features", "Solutions", "Pricing", "Login"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xl font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
              <Button className="bg-[#A5D7E8] text-[#0B2447] hover:bg-white w-full py-6 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(165,215,232,0.3)]">
                <a href="/signup">Get Started</a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: FeatureCardProps) => (
  <motion.div
    variants={fadeInUp}
    className="bg-[#19376D]/10 p-8 rounded-3xl border border-[#576CBC]/10 hover:border-[#A5D7E8]/30 transition-all duration-500 flex flex-col items-start gap-4 group backdrop-blur-sm"
  >
    <div className="w-12 h-12 bg-[#576CBC]/20 text-[#A5D7E8] rounded-xl flex items-center justify-center group-hover:bg-[#A5D7E8] group-hover:text-[#0B2447] transition-all duration-300">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
    <p className="text-[#576CBC]/60 leading-relaxed text-sm">{desc}</p>
    <button className="flex items-center gap-2 text-sm font-bold mt-4 text-[#A5D7E8]/50 hover:text-[#A5D7E8] transition-all">
      View integration <ArrowRight size={14} />
    </button>
  </motion.div>
);

const PricingCard = ({
  tier,
  price,
  features,
  featured = false,
}: PricingCardProps) => (
  <motion.div
    variants={fadeInUp}
    className={`relative flex flex-col p-10 rounded-[2.5rem] transition-all duration-500 h-full ${featured
      ? "bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_50px_rgba(165,215,232,0.3)]"
      : "bg-[#19376D]/10 text-white border border-[#576CBC]/10 hover:border-[#A5D7E8]/30 backdrop-blur-sm"
      }`}
  >
    <div className="mb-10">
      <h4
        className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${featured ? "text-black/50" : "text-slate-500"
          }`}
      >
        {tier}
      </h4>
      <div className="flex items-baseline gap-1">
        <span className="text-6xl font-black tracking-tighter">${price}</span>
        <span
          className={
            featured ? "text-[#0B2447]/60 text-sm" : "text-[#576CBC]/60 text-sm"
          }
        >
          /mo
        </span>
      </div>
    </div>

    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm font-medium">
          <CheckCircle2
            size={18}
            className={featured ? "text-[#0B2447]/20" : "text-[#A5D7E8]/20"}
          />
          <span className={featured ? "text-[#0B2447]/80" : "text-slate-300"}>
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <MotionButton
      {...scaleHover}
      className={`w-full py-6 rounded-2xl font-bold text-base transition-all h-auto ${featured
        ? "bg-[#0B2447] text-[#A5D7E8] hover:bg-black"
        : "bg-[#A5D7E8] text-[#0B2447] hover:bg-white shadow-[0_0_20px_rgba(165,215,232,0.3)]"
        }`}
    >
      Get Started
    </MotionButton>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060c16] text-white selection:bg-[#A5D7E8] selection:text-[#0B2447] font-sans">
      <Navbar />

      <main className="relative">
        <GridBackground />

        {/* --- HERO --- */}
        <section className="relative pt-48 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#19376D]/20 border border-[#576CBC]/20 px-4 py-1.5 rounded-full mb-12 hover:bg-[#19376D]/40 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[#A5D7E8] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A5D7E8]/60">
                Join the waitlist for ProjectFlow v1.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-[9rem] font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#A5D7E8]/40"
            >
              SHIP FASTER <br />
              TOGETHER.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-[#576CBC]/60 max-w-2xl mx-auto leading-relaxed mb-16"
            >
              The most powerful project management tool for high-performance
              teams. Minimal setup, maximum output.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MotionButton
                {...scaleHover}
                className="w-full sm:w-auto bg-[#A5D7E8] text-[#0B2447] px-12 py-6 rounded-2xl text-lg font-bold shadow-[0_0_30px_rgba(165,215,232,0.4)] h-auto hover:bg-white transition-all"
              >
                <Link to="/signup">Get Started</Link>
              </MotionButton>
            </motion.div>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#A5D7E8]/40 mb-4">
                  Core Principles
                </h2>
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Everything you need to{" "}
                  <span className="text-[#A5D7E8] italic">
                    master the sprint.
                  </span>
                </h3>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <FeatureCard
                icon={LayoutGrid}
                title="Bento Boards"
                desc="Beautiful, high-performance kanban boards that work as fast as you do."
              />
              <FeatureCard
                icon={Zap}
                title="Instant Sync"
                desc="Changes are reflected globally in 40ms. No loading spinners, ever."
              />
              <FeatureCard
                icon={Users}
                title="Live Sprints"
                desc="Collaborative sprint planning with real-time capacity management."
              />
            </motion.div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section
          id="pricing"
          className="py-32 px-6 bg-white/[0.02] border-y border-white/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-24">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#A5D7E8]/40 mb-4">
                Pricing
              </h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Ready to evolve?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                tier="Developer"
                price="0"
                features={[
                  "Up to 3 seats",
                  "10 projects",
                  "Real-time sync",
                  "Community Support",
                ]}
              />
              <PricingCard
                tier="Enterprise"
                price="19"
                featured
                features={[
                  "Unlimited everything",
                  "Priority Support",
                  "SAML/SSO",
                  "Dedicated Manager",
                  "Custom SLAs",
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <Logo
                className="mb-6"
                iconClassName="bg-[#A5D7E8] text-[#0B2447]"
                textClassName="text-2xl tracking-tighter"
              />
              <p className="text-[#576CBC]/60 text-sm max-w-xs leading-relaxed">
                The standard for modern agile software development.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
              <FooterList
                title="Product"
                links={["Features", "Security", "Roadmap"]}
              />
              <FooterList title="Resource" links={["Guides", "API", "Docs"]} />
              <FooterList
                title="Connect"
                links={["Twitter", "Github", "Discord"]}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
            <p className="text-[#576CBC]/40 text-[10px] font-bold uppercase tracking-widest">
              © 2025 ProjectFlow. Built for the future.
            </p>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#576CBC]/40">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterList({ title, links }: FooterListProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
        {title}
      </h4>
      <div className="flex flex-col gap-3">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="text-xs font-bold text-[#576CBC]/60 hover:text-[#A5D7E8] transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}
