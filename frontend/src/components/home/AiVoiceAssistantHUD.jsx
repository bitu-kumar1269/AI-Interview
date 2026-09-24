import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Sparkles, ChevronRight,
  RotateCcw, CheckCircle2, Award, Zap, Bot, MessageSquare, Play,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_QUESTIONS = [
  {
    id: 1,
    role: 'Full-Stack Software Engineer',
    category: 'React & Frontend Architecture',
    difficulty: 'Advanced',
    question: 'Can you explain how React’s Virtual DOM and Fiber reconciler optimize UI updates, and how you prevent unnecessary component re-renders in large applications?',
    sampleAnswer: 'React Fiber splits rendering into interruptible units of work. The reconciler computes diffs in memory using double-buffering before committing to the real DOM. To avoid redundant re-renders, I leverage React.memo with custom comparison, useMemo and useCallback for stable references, and state colocation.',
    feedback: {
      score: 95,
      atsMatch: '98%',
      confidence: 'High',
      delivery: 'Structured & Technical',
      keyPoints: ['Mentioned Fiber double-buffering', 'Highlighted state colocation', 'Used React.memo effectively'],
    },
  },
  {
    id: 2,
    role: 'Backend & Distributed Systems',
    category: 'System Design & Scalability',
    difficulty: 'Senior Level',
    question: 'How would you design a distributed, fault-tolerant rate limiter capable of throttling 100,000 requests per second across multiple microservices?',
    sampleAnswer: 'I would implement a Token Bucket or Sliding Window Counter algorithm using a distributed Redis cluster with Redis Sentinel for high availability. In high-throughput pipelines, I would use local in-memory token buffers with batched Redis syncs to prevent Redis connection bottlenecks.',
    feedback: {
      score: 93,
      atsMatch: '96%',
      confidence: 'Very High',
      delivery: 'Systematic Architecture',
      keyPoints: ['Token bucket algorithm chosen', 'Redis clustering with batched sync', 'Addressed Redis bottleneck mitigation'],
    },
  },
  {
    id: 3,
    role: 'Engineering Lead',
    category: 'Behavioral & Production Incidents',
    difficulty: 'Leadership',
    question: 'Tell me about a high-severity production outage you resolved under pressure. How did you coordinate the triage and post-mortem?',
    sampleAnswer: 'During a Black Friday spike, a cascading database deadlock locked our checkout service. I convened a war room, rolled back the most recent release to restore traffic, and applied a hotfix indexing missing join keys. Afterward, I published a blameless post-mortem with preventive alerting.',
    feedback: {
      score: 96,
      atsMatch: '99%',
      confidence: 'Decisive',
      delivery: 'STAR Framework Mastered',
      keyPoints: ['Followed blameless post-mortem culture', 'Swift rollback strategy', 'Root-cause analysis executed'],
    },
  },
  {
    id: 4,
    role: 'Cloud & DevOps Architect',
    category: 'Cloud Infrastructure & Microservices',
    difficulty: 'Architect',
    question: 'What architectural patterns do you apply to maintain data consistency across distributed microservices without distributed two-phase commit transactions?',
    sampleAnswer: 'I use the Saga pattern with event-driven choreography or orchestration via Apache Kafka. Each service completes its local ACID transaction and publishes domain events. If a step fails, compensating transactions are dispatched to revert upstream state with idempotency guaranteed.',
    feedback: {
      score: 94,
      atsMatch: '97%',
      confidence: 'Strong',
      delivery: 'Clear & Analytical',
      keyPoints: ['Saga orchestration explained', 'Compensating transactions applied', 'Idempotency guarantee highlighted'],
    },
  },
];

export default function AiVoiceAssistantHUD({ onVoiceStateChange }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [muted, setMuted] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const currentQ = MOCK_QUESTIONS[currentIdx];

  // Notify parent 3D component of voice state
  useEffect(() => {
    if (onVoiceStateChange) {
      onVoiceStateChange({
        isSpeaking,
        isListening,
        audioLevel: isSpeaking ? 0.9 : isListening ? 0.7 : 0.2,
      });
    }
  }, [isSpeaking, isListening, onVoiceStateChange]);

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current && synthRef.current.cancel) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current && recognitionRef.current.stop) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ─── 1. Speech Synthesis (AI Speaking) ───────────────────────────
  const speakQuestion = (textToSpeak) => {
    if (!synthRef.current) {
      toast.error('Browser speech synthesis is not supported.');
      return;
    }

    synthRef.current.cancel();

    if (muted) {
      toast('Voice is muted. Unmute to hear the AI interviewer.', { icon: '🔇' });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak || currentQ.question);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  // ─── 2. Speech Recognition (Candidate Answering) ─────────────────
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Stop speaking if AI is speaking
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser. You can use the Quick Sample Answer!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setEvaluation(null);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
        if (err.error === 'not-allowed') {
          toast.error('Microphone permission denied.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          analyzeAnswer(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      toast.error('Could not initialize microphone: ' + err.message);
      setIsListening(false);
    }
  };

  // ─── 3. Quick Sample Answer Simulation ───────────────────────────
  const handleUseSampleAnswer = () => {
    stopSpeaking();
    setTranscript(currentQ.sampleAnswer);
    analyzeAnswer(currentQ.sampleAnswer);
  };

  // ─── 4. Mock AI Evaluation Analysis ──────────────────────────────
  const analyzeAnswer = (answerText) => {
    setAnalyzing(true);
    setEvaluation(null);

    setTimeout(() => {
      setAnalyzing(false);
      setEvaluation(currentQ.feedback);
      toast.success('AI Evaluation Complete!', { icon: '🎯' });
    }, 1200);
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setTranscript('');
    setEvaluation(null);
    setCurrentIdx((prev) => (prev + 1) % MOCK_QUESTIONS.length);
  };

  const handleReplayQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakQuestion(currentQ.question);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* ── Top Status Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/90 dark:bg-surface-card/80 backdrop-blur-md border border-slate-200 dark:border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-cyan-400' : isListening ? 'bg-emerald-400 animate-pulse' : 'bg-brand-500'}`} />
            {(isSpeaking || isListening) && (
              <span className={`absolute w-5 h-5 rounded-full animate-ping opacity-75 ${isSpeaking ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                {isSpeaking ? 'AI Speaking...' : isListening ? 'Listening to You...' : 'AI Interviewer Online'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-600 dark:text-brand-300 font-mono font-medium">
                Llama-3 Neural
              </span>
            </div>
          </div>
        </div>

        {/* Audio Equalizer Bars & Voice Mute Toggle */}
        <div className="flex items-center gap-3">
          {/* Waveform Equalizer */}
          <div className="flex items-center gap-1 h-5 px-2 py-1 rounded bg-slate-200/80 dark:bg-black/40 border border-slate-300/60 dark:border-white/5">
            {[0.4, 0.8, 0.6, 1.0, 0.7, 0.9, 0.5, 0.8].map((baseHeight, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all duration-150 ${
                  isSpeaking ? 'bg-cyan-500 dark:bg-cyan-400' : isListening ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400 dark:bg-slate-600'
                }`}
                style={{
                  height: isSpeaking || isListening
                    ? `${Math.max(20, Math.sin(Date.now() / 150 + i) * 40 + baseHeight * 60)}%`
                    : `${baseHeight * 30}%`,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setMuted(!muted);
              if (!muted && isSpeaking) stopSpeaking();
            }}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-surface-hover transition-colors"
            title={muted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-brand-500 dark:text-brand-400" />}
          </button>
        </div>
      </div>

      {/* ── Question Card ────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-surface-card/95 dark:via-surface-card dark:to-surface-cardMuted/90 backdrop-blur-xl border border-slate-200 dark:border-surface-border shadow-md dark:shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Category & Difficulty Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {currentQ.role}
            </span>
            <span className="text-slate-400 dark:text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{currentQ.category}</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-700 dark:text-accent-300 border border-accent-500/25">
            {currentQ.difficulty}
          </span>
        </div>

        {/* The Question Text */}
        <p className="text-base sm:text-lg font-display font-semibold text-slate-900 dark:text-white leading-relaxed mb-5">
          &ldquo;{currentQ.question}&rdquo;
        </p>

        {/* Question Audio Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-surface-border/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReplayQuestion}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'bg-brand-500/15 text-brand-600 dark:text-brand-300 hover:bg-brand-500/25 border border-brand-500/30'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" /> Stop Speaking
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Listen to AI Voice
                </>
              )}
            </button>

            <button
              onClick={handleNextQuestion}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-surface-hover text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors border border-slate-200 dark:border-surface-border"
            >
              Next Question <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {currentIdx + 1} of {MOCK_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* ── Candidate Interaction Controls ─────────────────────────── */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-card/90 backdrop-blur-md border border-slate-200 dark:border-surface-border space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            Your Answer
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseSampleAnswer}
              className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline flex items-center gap-1"
              title="Click to fill with sample structured answer"
            >
              <Zap className="w-3 h-3" /> Quick Sample Answer
            </button>
          </div>
        </div>

        {/* Live Transcript / Input Area */}
        <div className="relative min-h-[56px] p-3 rounded-lg bg-slate-100/90 dark:bg-black/40 border border-slate-200 dark:border-surface-border text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
          {isListening ? (
            <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-pulse font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Listening... speak your response now
            </p>
          ) : transcript ? (
            <p className="text-slate-900 dark:text-slate-200 font-medium">{transcript}</p>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 italic">
              Click &quot;Speak Your Answer&quot; to test your microphone, or choose &quot;Quick Sample Answer&quot; to simulate instant AI evaluation.
            </p>
          )}
        </div>

        {/* Action Buttons: Mic Speak & Analyze */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                : 'bg-emerald-600/15 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/25 border border-emerald-500/30'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? 'Stop Recording' : 'Speak Your Answer'}
          </button>

          <button
            onClick={() => analyzeAnswer(transcript || currentQ.sampleAnswer)}
            disabled={analyzing}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Evaluating...
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" /> Analyze Response
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Real-Time Evaluation Result Card ─────────────────────── */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-slate-50 dark:bg-gradient-to-r dark:from-brand-950/40 dark:via-surface-card dark:to-surface-card border border-emerald-500/30 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  AI Assessment Feedback
                </h4>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/25">
                  Score: {evaluation.score}/100
                </span>
                <span className="px-2 py-0.5 rounded bg-accent-500/15 text-accent-700 dark:text-accent-300 border border-accent-500/25">
                  ATS: {evaluation.atsMatch}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
              <div className="p-2 rounded bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Confidence Level</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{evaluation.confidence}</span>
              </div>
              <div className="p-2 rounded bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Communication Style</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{evaluation.delivery}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Key Strengths Detected:</span>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.keyPoints.map((point, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
