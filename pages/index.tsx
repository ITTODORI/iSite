"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Briefcase, FolderPlus, Mail, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreativeTechnologistLandingPage() {
  const [activeDock, setActiveDock] = useState<string>("about");
  const [modalOpen, setModalOpen] = useState(false);

  const dockItems = [
    { id: "about", label: "About", icon: User, href: "#about" },
    { id: "portfolio", label: "Portfolio", icon: Briefcase, href: "/portfolio" },
    { id: "project", label: "Projects", icon: FolderPlus, href: "https://github.com/ITTODORI", external: true },
    { id: "contact", label: "Contact", icon: Mail, href: "https://wa.me/62085600447763", external: true },
  ];

  return (
    <section className="relative h-screen w-full bg-[#080808] text-white overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* UPPER-RIGHT RED/ORANGE RADIAL GLOW */}
      <div 
        className="absolute -top-32 -right-32 w-[600px] sm:w-[850px] lg:w-[1100px] h-[600px] sm:h-[850px] lg:h-[1100px] rounded-full pointer-events-none z-0 opacity-85"
        style={{
          background: "radial-gradient(circle at center, rgba(215, 55, 10, 0.75) 0%, rgba(160, 30, 0, 0.4) 35%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(70px)"
        }}
      />

      {/* TOP HEADER CENTERED */}
      <header className="relative z-30 w-full pt-8 sm:pt-10 flex justify-center items-center">
        <div className="text-center tracking-tight">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.05em] leading-none uppercase">
            CREATIVE
            <span className="block text-[10px] sm:text-[11px] tracking-[0.35em] font-medium text-gray-300 mt-1">
              TECHNOLOGIST
            </span>
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT LAYER */}
      <main className="relative z-20 w-full max-w-[1600px] mx-auto px-8 sm:px-16 flex-1 flex flex-col justify-center pb-16">
        {/* Left Column Text Content */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md space-y-2 lg:translate-y-[-40px]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#ED380D] font-bold block">
            LANDINGPAGE
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.92] tracking-tight text-white">
            iMen <br />
            Dev
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal pt-2 pr-4 opacity-80">
            a hybrit creator operating at the intersection of software engineering and digital media art.
          </p>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4 pt-6">
            <button 
              onClick={() => setModalOpen(true)}
              className="group flex items-center bg-white text-black pl-5 pr-1.5 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 hover:bg-gray-200 cursor-pointer shadow-lg"
            >
              <span>Start a Project</span>
              <span className="ml-3 flex items-center justify-center w-7 h-7 bg-black text-white rounded-full transition-transform group-hover:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* CENTRAL PORTRAIT IMAGE (Presisi skala & posisi bawah) */}
      <div className="absolute inset-x-0 bottom-0 top-16 flex justify-center items-end z-10 pointer-events-none">
        <div className="relative w-full max-w-[420px] sm:max-w-[650px] lg:max-w-[920px] h-[75vh] sm:h-[82vh] lg:h-[98vh]">
          <Image
            src="/src/26-04-16 08-45-29 0042.png"
            alt="iMen Dev Visual Portrait"
            fill
            priority
            className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />
        </div>
      </div>

      {/* GIANT OUTLINED STROKE WATERMARK */}
      <div className="absolute bottom-2 left-0 w-full overflow-hidden pointer-events-none leading-none z-0">
        <h1 
          className="text-[12.5vw] font-black text-center tracking-tighter uppercase select-none whitespace-nowrap opacity-20"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
            color: "transparent"
          }}
        >
          CREATIVE TECHNOLOGIST
        </h1>
      </div>

      {/* MINIMALIST FLOATING DOCKBAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-6 sm:gap-8 bg-black/50 backdrop-blur-xl border border-white/10 px-7 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDock === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : "_self"}
                rel={item.external ? "noopener noreferrer" : ""}
                onClick={() => setActiveDock(item.id)}
                className="group flex flex-col items-center justify-center transition-all duration-300 relative py-1"
              >
                <div className={`transition-all duration-300 ${
                  isActive ? "text-[#ED380D] scale-110" : "text-gray-400 hover:text-[#ED380D]"
                }`}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                <span className={`text-[10px] font-medium tracking-wide mt-1 transition-all duration-300 ${
                  isActive ? "text-[#ED380D] font-semibold opacity-100" : "text-gray-400 opacity-70 group-hover:opacity-100 group-hover:text-[#ED380D]"
                }`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </motion.div>
      </div>

      {/* INTERACTIVE MODAL DIALOG */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-white/15 w-full max-w-md p-6 sm:p-8 rounded-3xl relative shadow-2xl"
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-2">Start a Project</h3>
              <p className="text-xs text-gray-400 mb-6">
                Tell us about your vision, let's build an impactful digital project together.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); setModalOpen(false); alert("Message sent!"); }} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Your Name</label>
                  <input type="text" required className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ED380D] text-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Email</label>
                  <input type="email" required className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ED380D] text-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Project Details</label>
                  <textarea rows={3} required className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ED380D] text-white resize-none" placeholder="Describe your project..." />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 rounded-xl mt-2 text-sm transition hover:opacity-90 shadow-lg"
                >
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}