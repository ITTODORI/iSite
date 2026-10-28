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
import CursorGrid from "../components/CursorGrid";
import GhostFibers from "../components/GhostFibers";
import GradientASCII from "../components/GradientASCII";

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
      <div className="absolute inset-x-0 top-0 z-0 h-[75%] max-h-[500px] pointer-events-none opacity-80 mix-blend-screen">
        <GradientASCII
          colors={["#1ed88d","#f6f8ff","#a5ffe4","#38f8a8"]}
          shape="horizon"
          characters=" =+xX0S8#@"
          cellSize={18}
          density={0.8}
          glyphOpacity={0.85}
          glow={0.2}
          depthOfField={0}
          flicker={0.2}
          softness={0.5}
          scale={1}
          flow={0.5}
          speed={1}
          gradientOpacity={0.9}
          grain={0.08}
          variation={0}
          mouseInteraction
          scrambleRadius={0.1}
          clickEffect="wave"
          intro
          lightMode={false}
        />
      </div>
      
      <header className="relative z-10 flex items-center justify-between px-6 py-5 text-xs uppercase tracking-[0.2em] md:px-8">
        <div className="flex items-center gap-5">
          <span className="text-sm font-bold tracking-[0.25em] text-white">iMen</span>
          <span className="border border-neutral-800 px-2 py-1 text-neutral-500">Dev</span>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Change language" className="transition-colors hover:text-white">
            <Globe className="h-4 w-4" />
          </button>
          {/* <span className="text-neutral-500">PM</span> */}
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100svh-140px)] w-full items-center justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 xl:flex-row xl:gap-12">
          <div className="w-full space-y-5 xl:w-1/2">
            <div>
              <h1 className="flex flex-col items-start text-left text-4xl uppercase leading-tight tracking-[0.12em] text-white mix-blend-difference md:text-5xl">
                <StrokeText text="Creative" fontSize={70}/>
                <StrokeText text="Technologist" fillDelay={0.4} fontSize={50}/>
              </h1>
            </div>
            <p className="max-w-md text-md normal-case leading-relaxed tracking-normal text-neutral-200 drop-shadow-md">
              Hi there! I&apos;m <strong className="font-semibold text-white">iMen</strong>, a hybrid creator operating at the intersection of software engineering and digital media arts.
            </p>
            <div className="order-4 mt-5 text-left md:order-3 md:mt-8">
              <a
                href="https://github.com/ITTODORI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-md font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-[#27ffb7] hover:text-[#0e0e0e] hover:border-[#27ffb7] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#27ffb7] focus:ring-offset-2 focus:ring-offset-[#0e0e0e]"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2 xl:mx-0 xl:w-1/2 xl:max-w-none xl:justify-end">
            <div className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950/80 backdrop-blur-sm shadow-2xl sm:w-56 xl:w-64">
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

      <LogoLoop 
        logos={techLogos}
        speed={40}
        direction="left"
        logoHeight={30} gap={40}
      />
    </section>
  );
}

// Design Section
function DesignSection() {
  const { ref, inView } = useInViewObserver();
  const [selectedImage, setSelectedImage] = useState<{ image: string; title: string } | null>(null);

  return (
    <section 
      id="designer" 
      ref={ref} 
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#0e0e0e] py-12 text-neutral-400 md:py-16"
    >
      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-4 opacity-15 md:grid-cols-6">
        {Array.from({ length: 24 }, (_, index) => (
          <div key={index} className="border-[0.5px] border-neutral-500/30" />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 md:px-12 my-auto">
        <div className="mb-4 md:mb-6">
          {inView && (
            <FadeContent key={`design-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">02.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`design-fold-${inView}`} text="Design" color="#27ffb7"/>}
        </div>
        
        <div className="relative h-[clamp(320px,50vh,480px)] w-full [&_button:has(svg)]:block">
          <DriftWall 
            items={driftItems.map(item => ({
              ...item,
              onClick: () => setSelectedImage(item)
            }))} 
            columns={4} 
            tileWidth={280} 
            tileHeight={190} 
            gap={20} 
            speed={25} 
            grayscale 
          />
        </div>
      </div>

      {/* Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative flex flex-col items-center max-w-4xl max-h-[90vh] w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <span className="text-sm font-semibold tracking-wider text-white">
                {selectedImage.title}
              </span>
              <button 
                type="button"
                onClick={() => setSelectedImage(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white border border-neutral-700 text-sm shadow transition-all hover:bg-[#27ffb7] hover:text-[#0e0e0e]"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-[65vh] flex items-center justify-center overflow-hidden my-auto">
              <Image 
                src={selectedImage.image} 
                alt={selectedImage.title}
                fill
                sizes="(max-width: 768px) 100vw, 85vw"
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-20 w-full mt-6 md:mt-8">
        <TextLoop 
          text="Portfolio ✦ Dev" 
          curviness={50}
          fontSize={30}
          ribbonWidth={50}
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
    <section id="motion-graphic" ref={ref} className="relative isolate flex h-[100svh] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] px-4 py-8 text-neutral-400 sm:px-6 md:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center h-full">
        <div className="mb-4 md:mb-6">
          {inView && (
            <FadeContent key={`motion-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">03.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`motion-fold-${inView}`} text="Motion Effects" color="#27ffb7"/>}
        </div>
        <div className="relative h-[clamp(380px,68vh,620px)] w-full">
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
    <section id="3d-animation" ref={ref} className="relative isolate flex h-[100svh] w-full flex-col justify-center overflow-hidden bg-[#27cf9a] px-4 py-8 text-[#0e0e0e] sm:px-6 md:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center h-full">
        <div className="mb-4 md:mb-6">
          {inView && (
            <FadeContent key={`3d-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#0e0e0e]/70">04.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`3d-fold-${inView}`} text="3D Animation" color="#0e0e0e"/>}
        </div>
        <div className="relative h-[clamp(380px,68vh,620px)] w-full">
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
    <section id="software-engineer" ref={ref} className="relative isolate flex h-[100svh] w-full flex-col justify-center overflow-hidden bg-[#0e0e0e] text-neutral-400">
      <div className="absolute inset-0 z-0">
        <CursorGrid
          cellSize={60}
          color="#27ffb7"
          gridColor="#27ffb7"
          highlight="area"
          gridStyle="lines"
          radius={140}
          holdTime={400}
          fadeDuration={800}
          fillOpacity={0.06}
          gridOpacity={0.08}
          spotlight={0.6}
          clickPulse
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center h-full px-4 py-8 sm:px-6 md:px-12 pointer-events-none">
        <div className="order-1 mb-3 md:mb-4 pointer-events-auto">
          {inView && (
            <FadeContent key={`software-fade-${inView}`} blur duration={1000}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">05.</p>
            </FadeContent>
          )}
          {inView && <FoldText key={`software-fold-${inView}`} text="Software" color="#27ffb7"/>}
        </div>
        <p className="order-2 mb-3 mx-auto max-w-md text-center text-sm text-neutral-400 md:order-4 md:mb-0 md:mt-3 pointer-events-auto">
          Explore the projects, tools, and experiments behind my software work on GitHub.
        </p>
        <div className="relative order-3 h-[clamp(360px,60vh,540px)] w-full md:order-2 pointer-events-auto">
          <DepthCarousel 
            showControls={false}
            autoplayDelay={5000}
            loop={true}
          />
        </div>
        <div className="order-4 mt-4 text-center md:order-3 md:mt-5 pointer-events-auto">
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