"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, Globe } from "lucide-react";
import OptionWheel from './component/OptionWheel';
import StrokeText from "./component/StrokeText";
import LogoLoop from "./component/LogoLoop";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss,
  SiPhp,
  SiPython,
  SiLaravel,
  SiArchlinux,
  SiGnome,
  SiFigma,
  SiDavinciresolve,
  SiBlender,
  SiMysql,
  SiPostgresql
} from 'react-icons/si';

const technologies = ["W", "php", "Sass", "JS", "GSAP"];

// LogoLoop List
const techLogos = [
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiReact />, title: "React Native", href: "https://reactnative.dev" },
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiLaravel />, title: "Laravel", href: "https://laravel.com" },
  { node: <SiPhp />, title: "PHP", href: "https://www.php.net" },
  { node: <SiArchlinux />, title: "Arch Linux", href: "https://archlinux.org" },
  { node: <SiGnome />, title: "GNOME", href: "https://www.gnome.org" },
  { node: <SiFigma />, title: "Figma", href: "https://www.figma.com" },
  { node: <SiDavinciresolve />, title: "DaVinci Resolve", href: "https://www.blackmagicdesign.com/products/davinciresolve" },
  { node: <SiBlender />, title: "Blender", href: "https://www.blender.org" },
  { node: <SiMysql />, title: "MySQL", href: "https://www.mysql.com" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
];

// Component Ruler
function Ruler({ count = 40 }: { count?: number }) {
  return (
    <div className="flex h-3 w-full items-end justify-between opacity-30" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span 
          key={index} 
          className={`w-px bg-neutral-500 ${index % 5 === 0 ? "h-3" : "h-1.5"}`} 
        />
      ))}
    </div>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="relative isolate flex min-h-[680px] flex-col justify-between overflow-hidden bg-[#0e0e0e] text-neutral-400">
      
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-4 opacity-15 md:grid-cols-6">
        {Array.from({ length: 24 }, (_, index) => (
          <div key={index} className="border-[0.5px] border-neutral-500/30" />
        ))}
      </div>
      
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-xs text-neutral-600">
        +
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-neutral-800/40 px-6 py-5 text-xs uppercase tracking-[0.2em] md:px-8">
        <div className="flex items-center gap-5">
          <span className="text-sm font-bold tracking-[0.25em] text-white">iMen</span>
          <span className="border border-neutral-800 px-2 py-1 text-neutral-500">Dev</span>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Change language" className="transition-colors hover:text-white">
            <Globe className="h-4 w-4" />
          </button>
          <span className="text-neutral-500">PM</span>
        </div>
      </header>

      {/* Main Hero Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-140px)] w-full items-center justify-center px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between md:flex-row">
          
          {/* 01. Creative Technologist */}
          <div className="w-full space-y-6 md:w-1/2">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">01. </p>
              <h1 className="flex flex-col items-start text-left text-4xl uppercase leading-tight tracking-[0.12em] text-neutral-200 md:text-5xl">
                <StrokeText text="Creative" fontSize={70}/>
                <StrokeText text="Technologist" fillDelay={0.4} fontSize={50}/>
              </h1>
            </div>
            <p className="max-w-md text-md normal-case leading-relaxed tracking-normal text-neutral-300">
              Hi there! I&apos;m <strong className="font-semibold text-white">iMen</strong>, a hybrid creator operating at the intersection of software engineering and digital media arts.
            </p>
          </div>

          {/* Photo ASCII & Skill Based Wheel */}
          <div className="flex w-full items-center justify-center sm:flex-row md:w-1/2">
            
            {/* Photo ASCII */}
            <div className="relative aspect-square w-65 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950 shadow-2xl md:w-70">
              <div className="absolute inset-0 flex items-center justify-center scale-110">
                <Image
                  src="/photo-ascii.svg"
                  alt="Profile illustration"
                  fill
                  priority
                  sizes="(max-width: 768px) 288px, 320px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Skill Based Wheel */}
            <div className="h-48 w-full max-w-md md:h-56">
              <OptionWheel />
            </div>
            
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-800/40 px-6 py-6 md:px-8 overflow-hidden">
        <div className="w-full flex items-center justify-center">
          <LogoLoop
            logos={techLogos}
            speed={40}
            direction="left"
            logoHeight={30}
            gap={40}
          />
        </div>
      </footer>

    </section>
  );
}

// Selected Work Component
function SelectedWork() {
  return (
    <section className="relative border-t border-zinc-800/80 bg-[#0a0d0f] text-[#c3c7cb]">
      
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />
      
      <div className="relative mx-auto max-w-7xl">
        
        <div className="grid border-b border-zinc-800 md:grid-cols-12">
          
          {/* Header Title */}
          <div className="border-b border-zinc-800 p-6 md:col-span-8 md:border-r md:p-10">
            <h2 className="text-3xl font-light uppercase tracking-[0.16em] text-zinc-100 md:text-4xl">Selected Work</h2>
            <p className="mt-2 text-sm text-zinc-500">A curated collection of web development projects</p>
          </div>

          {/* Action Link */}
          <div className="flex items-center justify-start p-6 md:col-span-4 md:justify-end md:p-10">
            <a href="mailto:TIM@VANLENT.DEV?subject=Start%20a%20project" className="text-sm tracking-wider text-zinc-400 transition-colors hover:text-white">
              Start a project <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Graphic Element */}
          <div className="flex min-h-64 items-center justify-center border-t border-zinc-800 p-8 md:col-span-3 md:row-start-2 md:border-r">
            <div className="h-40 w-40 rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_35%_30%,#a1a1aa,#27272a_42%,#09090b_72%)] shadow-[0_0_80px_rgba(148,163,184,.14)]" />
          </div>

          {/* Project Preview & Sub-boxes */}
          <div className="border-t border-zinc-800 p-4 md:col-span-4 md:row-start-2 md:border-r">
            <div className="relative flex aspect-[16/10] items-end overflow-hidden border border-zinc-800 bg-[#d9d4c9] p-5 text-[#171717] sm:p-8">
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-[#171717]/20" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em]">Arithma</p>
                <p className="mt-2 max-w-[12rem] text-2xl font-light leading-tight">Finance, made clear.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex aspect-[16/10] items-end border border-zinc-800 bg-[#3c4345] p-3 text-xs uppercase tracking-widest text-zinc-300">System</div>
              <div className="flex aspect-[16/10] items-end border border-zinc-800 bg-[#1b2528] p-3 text-xs uppercase tracking-widest text-zinc-400">Motion</div>
            </div>
          </div>

          {/* Vertical Preview Card */}
          <div className="flex min-h-56 items-center justify-center border-t border-zinc-800 p-4 md:col-span-2 md:row-start-2 md:border-r">
            <div className="flex aspect-[9/16] h-52 items-end border border-zinc-700 bg-[#d9d4c9] p-3 text-xs text-[#171717]">Arithma</div>
          </div>

          {/* Tech Stack List */}
          <div className="grid grid-cols-5 border-t border-zinc-800 md:col-span-1 md:row-start-2 md:grid-cols-1 md:border-r">
            {technologies.map((technology) => (
              <div key={technology} className="flex items-center justify-center border-r border-zinc-800 p-3 text-xs text-zinc-500 last:border-r-0 md:border-b md:border-r-0 md:last:border-b-0">
                {technology}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-5 border-t border-zinc-800 p-6 text-sm leading-relaxed text-zinc-500 md:col-span-2 md:row-start-2 md:p-8">
            <p className="text-zinc-400">Modern financial services platform focused on clarity, trust, and usability.</p>
            <p>A bespoke build combining a refined visual system with performance-friendly interactions.</p>
          </div>

        </div>

        {/* Carousel / Navigation Footer */}
        <div className="grid h-16 grid-cols-12 border-b border-zinc-800">
          <button type="button" aria-label="Previous project" className="col-span-2 flex items-center justify-center border-r border-zinc-800 transition-colors hover:bg-zinc-900 md:col-span-1">
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <a href="#project" aria-label="Open project" className="col-span-2 flex items-center justify-center border-r border-zinc-800 transition-colors hover:bg-zinc-900 md:col-span-1">
            <ExternalLink className="h-4 w-4" />
          </a>
          
          <span id="project" className="col-span-6 flex items-center justify-center text-xl font-light tracking-wider text-zinc-200 md:col-span-9">
            arithma
          </span>
          
          <button type="button" aria-label="Next project" className="col-span-2 flex items-center justify-center transition-colors hover:bg-zinc-900 md:col-span-1">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-3">
          <Ruler count={40} />
        </div>

      </div>
    </section>
  );
}

// Main Component
export default function Home() {
  return (
    <main className="overflow-hidden bg-[#0e0e0e] font-sans selection:bg-white selection:text-black">
      <Hero />
      <SelectedWork />
    </main>
  );
}