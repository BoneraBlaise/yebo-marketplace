import React from "react";
import {
  HiOutlineCamera,
  HiOutlinePhotograph,
  HiOutlineSparkles,
  HiOutlineScale,
} from "react-icons/hi";
import { Badge } from "../../ui";
import AICard from "../primitives/AICard";

const AIVirtualTryOn = ({ compact = false }) => (
  <section className={compact ? "py-6" : "pdp-section"} aria-label="Virtual Try-On preview">
    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0a1211] border border-white/10 min-h-[320px] lg:min-h-[380px] shadow-2xl shadow-yebone-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary/30 via-[#0a1211] to-yebone-gold/15" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-56 border border-yebone-gold/20 rounded-[1.5rem] yebone-scan-line pointer-events-none opacity-60" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-56 border border-white/10 rounded-[1.5rem] pointer-events-none opacity-40" />

      <div className="relative z-10 p-6 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="gold">Coming Soon</Badge>
          <span className="text-xs text-gray-400">Virtual Try-On · Presentation only</span>
        </div>

        <h3 className="font-Poppins text-xl lg:text-2xl font-bold text-white mb-2">
          AI Virtual Try-On
        </h3>
        <p className="text-gray-400 text-sm max-w-lg mb-8">
          Upload a photo or use your camera. AI scan animation previews fit and size recommendations.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AICard glass className="!bg-black/30 !border-white/10 text-center" hover={false}>
            <HiOutlinePhotograph className="mx-auto text-yebone-gold mb-2" size={28} />
            <p className="text-white text-sm font-semibold">Upload photo</p>
            <p className="text-gray-500 text-[11px] mt-1">Placeholder</p>
          </AICard>
          <AICard glass className="!bg-black/30 !border-white/10 text-center" hover={false}>
            <HiOutlineCamera className="mx-auto text-yebone-gold mb-2" size={28} />
            <p className="text-white text-sm font-semibold">Use camera</p>
            <p className="text-gray-500 text-[11px] mt-1">Placeholder</p>
          </AICard>
          <AICard glass className="!bg-black/30 !border-white/10 text-center" hover={false}>
            <HiOutlineSparkles className="mx-auto text-emerald-400 mb-2 yebone-pulse-dot" size={28} />
            <p className="text-white text-sm font-semibold">AI scan</p>
            <p className="text-gray-500 text-[11px] mt-1">Animation preview</p>
          </AICard>
          <AICard glass className="!bg-black/30 !border-white/10 text-center" hover={false}>
            <div className="flex justify-center gap-2 mb-2">
              <div className="w-10 h-12 rounded-lg bg-white/10 border border-white/20" />
              <span className="text-gray-500 self-center">→</span>
              <div className="w-10 h-12 rounded-lg bg-yebone-gold/20 border border-yebone-gold/30" />
            </div>
            <p className="text-white text-sm font-semibold">Before / After</p>
            <p className="text-gray-500 text-[11px] mt-1">Placeholder</p>
          </AICard>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6 max-w-xl">
          <div className="yebone-glass rounded-xl p-3 border border-white/10 text-center">
            <HiOutlineScale className="mx-auto text-yebone-gold mb-1" size={20} />
            <p className="text-[10px] text-gray-400 uppercase">Recommended size</p>
            <p className="text-white font-semibold text-sm">M / 42</p>
          </div>
          <div className="yebone-glass rounded-xl p-3 border border-white/10 text-center">
            <p className="text-[10px] text-gray-400 uppercase">Recommended fit</p>
            <p className="text-white font-semibold text-sm">Regular fit</p>
          </div>
          <div className="yebone-glass rounded-xl p-3 border border-white/10 text-center">
            <p className="text-[10px] text-gray-400 uppercase">Confidence</p>
            <p className="text-yebone-gold font-semibold text-sm">87%</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AIVirtualTryOn;
