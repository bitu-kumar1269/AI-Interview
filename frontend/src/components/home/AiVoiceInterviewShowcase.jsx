import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Radio, Activity, Cpu } from 'lucide-react';
import AiInterview3D from './AiInterview3D';
import AiVoiceAssistantHUD from './AiVoiceAssistantHUD';

export default function AiVoiceInterviewShowcase() {
  const [voiceState, setVoiceState] = useState({
    isSpeaking: false,
    isListening: false,
    audioLevel: 0.3,
  });

  const handleVoiceStateChange = useCallback((newState) => {
    setVoiceState(newState);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto my-8">
      {/* Outer Glow & Ambient Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-accent-600/15 to-brand-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-surface-card/90 border border-slate-200 dark:border-surface-border backdrop-blur-2xl shadow-xl dark:shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Decorative Grid Lines Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200 dark:border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-brand shadow-brand flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white tracking-wide">
                  Interactive AI Voice Interview Simulation
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30">
                  <Activity className="w-3 h-3 text-brand-500 dark:text-brand-400" /> Real-Time 3D
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience dynamic interview generation with live speech synthesis, mic capture, and ATS scoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
              <Radio className={`w-3.5 h-3.5 ${voiceState.isSpeaking ? 'text-brand-500 dark:text-brand-400 animate-pulse' : voiceState.isListening ? 'text-emerald-500 dark:text-emerald-400 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`} />
              {voiceState.isSpeaking ? 'VOICE OUT: 44.1kHz' : voiceState.isListening ? 'MIC IN: ACTIVE' : 'VOICE ENGINE READY'}
            </span>
          </div>
        </div>

        {/* 2-Column Showcase: Left = 3D Holographic AI, Right = Voice Assistant HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          {/* Left: 3D Holographic Core (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[440px]">
            {/* Background Cybernetic Rings & Glow Pedestal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-brand-600/15 via-accent-600/10 to-brand-500/15 blur-2xl" />
              <div className="absolute bottom-6 w-48 h-8 rounded-full bg-brand-500/20 blur-xl" />
            </div>

            {/* Three.js 3D Canvas */}
            <div className="w-full h-full min-h-[360px] relative z-10 flex items-center justify-center">
              <AiInterview3D
                isSpeaking={voiceState.isSpeaking}
                isListening={voiceState.isListening}
                audioLevel={voiceState.audioLevel}
              />
            </div>

            {/* Floating Info Pill under 3D model */}
            <div className="relative z-10 mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-surface-cardMuted/80 backdrop-blur-md border border-slate-200 dark:border-surface-border text-[11px] text-slate-600 dark:text-slate-400 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              <span>3D Neural Model: Move cursor to inspect core</span>
            </div>
          </div>

          {/* Right: Voice Assistant HUD (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AiVoiceAssistantHUD onVoiceStateChange={handleVoiceStateChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
