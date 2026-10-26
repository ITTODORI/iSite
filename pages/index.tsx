"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import OptionWheel from '../components/OptionWheel';
import StrokeText from "../components/StrokeText";
import FoldText from "../components/FoldText";
import FadeContent from "../components/FadeContent";
import TextLoop from "../components/TextLoop";
import LogoLoop from "../components/LogoLoop";
import DriftWall from '../components/DriftWall';
import DepthCarousel from '../components/DepthCarousel';
import MorphSlider from '../components/MorphSlider';
import AccordionGallery from "../components/AccordionGallery";

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

// Drift Items
const driftItems = [
  { image: '/src/Certificate.png', title: 'Tile 1' },
  { image: '/src/Clothing.png', title: 'Tile 2' },
  { image: '/src/Packaging.png', title: 'Tile 3' },
  { image: '/src/Social.png', title: 'Tile 4' },
  { image: '/src/Sticker.png', title: 'Tile 5' },
  { image: '/src/Coverbook.png', title: 'Tile 6' },
  { image: '/src/Logotype.png', title: 'Tile 7' },
  { image: '/src/Certificate.png', title: 'Tile 8' },
  { image: '/src/Clothing.png', title: 'Tile 9' },
  { image: '/src/Packaging.png', title: 'Tile 10' },
  { image: '/src/Social.png', title: 'Tile 11' },
  { image: '/src/Sticker.png', title: 'Tile 12' },
  { image: '/src/Coverbook.png', title: 'Tile 13' },
  { image: '/src/Logotype.png', title: 'Tile 14' },
];

// Custom Hook Scroll Viewport Observer
function useInViewObserver(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, inView };
}

// Hero Section
function Hero() {
  const wheelItems = ['Designer', 'Motion Graphic', '3D Animation', 'Software Engineer'];

  const handleWheelItemClick = (_index: number, item: string) => {
    const sectionIdMap: Record<string, string> = {
      'Designer': 'designer',
      'Motion Graphic': 'motion-graphic',
      '3D Animation': '3d-animation',
      'Software Engineer': 'software-engineer',
    };

    const targetId = sectionIdMap[item];
    if (targetId) {
      // Wheel centers on click first, then smoothly scrolls after a brief snap animation
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  };

  return (
    <section className="relative isolate flex min-h-[680px] flex-col justify-between overflow-hidden bg-[#0e0e0e] text-neutral-400">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-4 opacity-15 md:grid-cols-6">
        {Array.from({ length: 24 }, (_, index) => (
          <div key={index} className="border-[0.5px] border-neutral-500/30" />
        ))}
      </div>
      
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

      <div className="relative z-10 flex min-h-[calc(100svh-140px)] w-full items-center justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 xl:flex-row xl:gap-12">
          <div className="w-full space-y-5 xl:w-1/2">
            <div>
              <h1 className="flex flex-col items-start text-left text-4xl uppercase leading-tight tracking-[0.12em] text-neutral-200 md:text-5xl">
                <StrokeText text="Creative" fontSize={70}/>
                <StrokeText text="Technologist" fillDelay={0.4} fontSize={50}/>
              </h1>
            </div>
            <p className="max-w-md text-md normal-case leading-relaxed tracking-normal text-neutral-300">
              Hi there! I&apos;m <strong className="font-semibold text-white">iMen</strong>, a hybrid creator operating at the intersection of software engineering and digital media arts.
            </p>
            <div className="order-4 mt-5 text-center md:order-3 md:mt-8">
              <a
                href="https://github.com/ITTODORI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-2.5 text-md font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-[#27ffb7] hover:text-[#0e0e0e] hover:border-[#27ffb7] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#27ffb7] focus:ring-offset-2 focus:ring-offset-[#0e0e0e]"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2 xl:mx-0 xl:w-1/2 xl:max-w-none xl:justify-end">
            <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950 shadow-2xl sm:w-56 xl:w-64">
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
            <div className="h-40 w-full max-w-sm sm:h-48 sm:min-w-0 sm:flex-1 xl:h-56 xl:max-w-md">
              <OptionWheel 
                items={wheelItems}
                defaultSelected={1}
                activeColor="#27ffb7"
                onItemClick={handleWheelItemClick}
              />
            </div>
          </div>
        </div>
      </div>

      <LogoLoop logos={techLogos} speed={40} direction="left" logoHeight={30} gap={40} />
    </section>
  );
}

// Design Section
function DesignSection() {
  const { ref, inView } = useInViewObserver();

  return (
    <section id="designer" ref={ref} className="relative isolate flex min-h-[560px] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] py-8 text-neutral-400 md:min-h-[680px] md:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="mb-6 md:mb-8">
          {inView && (
            <FadeContent key={`design-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">02.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`design-fold-${inView}`} text="Design" color="#27ffb7"/>}
        </div>
        <div className="relative h-[clamp(400px,80vh,500px)] w-full [&_button:has(svg)]:block">
          <DriftWall items={driftItems} columns={5} tileWidth={200} tileHeight={132} gap={18} speed={30} grayscale />
        </div>
      </div>
      <footer className="relative z-20 -mt-16 md:-mt-32">
          <TextLoop text="Portfolio ✦ Dev" 
          curviness={50}
          ribbonColor="#27cf9a"
          pauseOnHover={false}
          />
      </footer>
    </section>
  );
}

// Motion Section
function MotionSection() {
  const { ref, inView } = useInViewObserver();

  return (
    <section id="motion-graphic" ref={ref} className="relative isolate flex min-h-[560px] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] py-10 text-neutral-400 md:min-h-[680px] md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="mb-6 md:mb-8">
          {inView && (
            <FadeContent key={`motion-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">03.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`motion-fold-${inView}`} text="Motion Effects" color="#27ffb7"/>}
        </div>
        <div className="relative h-[clamp(300px,60vh,500px)] w-full">
          <MorphSlider autoplay loop showCaptions showControls showIndicators />
        </div>
      </div>
    </section>
  );
}

// 3D Animation Section
function AnimationSection() {
  const { ref, inView } = useInViewObserver();

  return (
    <section id="3d-animation" ref={ref} className="relative isolate flex min-h-[560px] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] py-10 text-neutral-400 md:min-h-[680px] md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="mb-6 md:mb-8">
          {inView && (
            <FadeContent key={`3d-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">04.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`3d-fold-${inView}`} text="3D Animation" color="#27ffb7"/>}
        </div>
        <div className="relative h-[clamp(300px,60vh,500px)] w-full">
          <AccordionGallery 
            autoPlay={true} 
            loop={true} 
            showCaptions={true} 
            showControls={true} 
            showIndicators={true} 
          />
        </div>
      </div>
    </section>
  );
}

// Software Section
function SoftwareSection() {
  const { ref, inView } = useInViewObserver();

  return (
    <section id="software-engineer" ref={ref} className="relative isolate flex min-h-[560px] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] py-10 text-neutral-400 md:min-h-[680px] md:py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 md:px-12">
        <div className="order-1 mb-4 md:mb-8">
          {inView && (
            <FadeContent key={`software-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">05.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`software-fold-${inView}`} text="Software" color="#27ffb7"/>}
        </div>
        <p className="order-2 mb-4 mx-auto max-w-md text-center text-sm text-neutral-400 md:order-4 md:mb-0 md:mt-3">
          Explore the projects, tools, and experiments behind my software work on GitHub.
        </p>
        <div className="relative order-3 h-[clamp(400px,62vh,480px)] w-full md:order-2 md:h-[clamp(300px,60vh,500px)]">
          <DepthCarousel 
            showControls={false}
            autoplayDelay={5000}
            loop={true}
          />
        </div>
        <div className="order-4 mt-5 text-center md:order-3 md:mt-8">
          <a
            href="https://github.com/ITTODORI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-md font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-[#27ffb7] hover:text-[#0e0e0e] hover:border-[#27ffb7] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#27ffb7] focus:ring-offset-2 focus:ring-offset-[#0e0e0e]"
          >
            Github Profile
          </a>
        </div>
      </div>
    </section>
  );
}

// Selected Work Component
// function SelectedWork() {
//   return (
//     <section className="relative border-t border-zinc-800/80 bg-[#0a0d0f] text-[#c3c7cb]">
//       <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />

//       <div className="relative mx-auto max-w-7xl">
//         <div className="grid border-b border-zinc-800 md:grid-cols-12">
//           <div className="border-b border-zinc-800 p-6 md:col-span-8 md:border-r md:p-10">
//             <h2 className="text-3xl font-light uppercase tracking-[0.16em] text-zinc-100 md:text-4xl">Selected Work</h2>
//             <p className="mt-2 text-sm text-zinc-500">A curated collection of web development projects</p>
//           </div>

//           <div className="flex items-center justify-start p-6 md:col-span-4 md:justify-end md:p-10">
//             <a href="mailto:TIM@VANLENT.DEV?subject=Start%20a%20project" className="text-sm tracking-wider text-zinc-400 transition-colors hover:text-white">
//               Start a project <span aria-hidden="true">↗</span>
//             </a>
//           </div>

//           <div className="flex min-h-64 items-center justify-center border-t border-zinc-800 p-8 md:col-span-3 md:row-start-2 md:border-r">
//             <div className="h-40 w-40 rounded-full border border-zinc-700 bg-[radial-gradient(circle_at_35%_30%,#a1a1aa,#27272a_42%,#09090b_72%)] shadow-[0_0_80px_rgba(148,163,184,.14)]" />
//           </div>

//           <div className="border-t border-zinc-800 p-4 md:col-span-4 md:row-start-2 md:border-r">
//             <div className="relative flex aspect-[16/10] items-end overflow-hidden border border-zinc-800 bg-[#d9d4c9] p-5 text-[#171717] sm:p-8">
//               <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-[#171717]/20" />
//               <div>
//                 <p className="text-xs uppercase tracking-[0.3em]">Arithma</p>
//                 <p className="mt-2 max-w-[12rem] text-2xl font-light leading-tight">Finance, made clear.</p>
//               </div>
//             </div>
//             <div className="mt-3 grid grid-cols-2 gap-3">
//               <div className="flex aspect-[16/10] items-end border border-zinc-800 bg-[#3c4345] p-3 text-xs uppercase tracking-widest text-zinc-300">System</div>
//               <div className="flex aspect-[16/10] items-end border border-zinc-800 bg-[#1b2528] p-3 text-xs uppercase tracking-widest text-zinc-400">Motion</div>
//             </div>
//           </div>

//           <div className="flex min-h-56 items-center justify-center border-t border-zinc-800 p-4 md:col-span-2 md:row-start-2 md:border-r">
//             <div className="flex aspect-[9/16] h-52 items-end border border-zinc-700 bg-[#d9d4c9] p-3 text-xs text-[#171717]">Arithma</div>
//           </div>

//           <div className="grid grid-cols-5 border-t border-zinc-800 md:col-span-1 md:row-start-2 md:grid-cols-1 md:border-r">
//             {technologies.map((technology) => (
//               <div key={technology} className="flex items-center justify-center border-r border-zinc-800 p-3 text-xs text-zinc-500 last:border-r-0 md:border-b md:border-r-0 md:last:border-b-0">
//                 {technology}
//               </div>
//             ))}
//           </div>

//           <div className="space-y-5 border-t border-zinc-800 p-6 text-sm leading-relaxed text-zinc-500 md:col-span-2 md:row-start-2 md:p-8">
//             <p className="text-zinc-400">Modern financial services platform focused on clarity, trust, and usability.</p>
//             <p>A bespoke build combining a refined visual system with performance-friendly interactions.</p>
//           </div>
//         </div>

//         <div className="grid h-16 grid-cols-12 border-b border-zinc-800">
//           <button type="button" aria-label="Previous project" className="col-span-2 flex items-center justify-center border-r border-zinc-800 transition-colors hover:bg-zinc-900 md:col-span-1">
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <a href="#project" aria-label="Open project" className="col-span-2 flex items-center justify-center border-r border-zinc-800 transition-colors hover:bg-zinc-900 md:col-span-1">
//             <ExternalLink className="h-4 w-4" />
//           </a>
//           <span id="project" className="col-span-6 flex items-center justify-center text-xl font-light tracking-wider text-zinc-200 md:col-span-9">
//             arithma
//           </span>
//           <button type="button" aria-label="Next project" className="col-span-2 flex items-center justify-center transition-colors hover:bg-zinc-900 md:col-span-1">
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>

//         <div className="px-4 py-3">
//           <Ruler count={40} />
//         </div>
//       </div>
//     </section>
//   );
// }

// Main Component
export default function Home() {
  return (
    <main className="overflow-hidden bg-[#0e0e0e] font-sans selection:bg-white selection:text-black">
      <Hero />
      <DesignSection />
      <MotionSection />
      <AnimationSection />
      <SoftwareSection />
    </main>
  );
}