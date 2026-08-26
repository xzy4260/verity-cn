"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cube3D from "@/components/Cube3D";

const PLAYLIST = [
  { src: "/matrix.mp3", title: "Matrix" },
  { src: "/mygal.mp3", title: "My Gal" },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  // 用 ref 镜像状态，避免事件闭包读到过期值
  const trackIdxRef = useRef(0);
  const isPlayingRef = useRef(false);
  const loadTokenRef = useRef(0);

  const isDark = typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true;

  const initAudio = useCallback(() => {
    if (!audioRef.current || analyserRef.current) return;
    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
    // 部分环境（如以 127.0.0.1 访问）下 AudioContext 创建后是 suspended，
    // 媒体元素接入后即使播放也无声，必须显式唤醒
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
  }, []);

  // 加载指定曲目；autoplay 时等 canplay 再播。
  // src 完全走命令式管理（不走 React 受控），避免重渲染二次设置 src 触发 load 打断 play() 导致 AbortError
  const loadTrack = useCallback((newIdx: number, autoplay: boolean) => {
    const a = audioRef.current;
    if (!a) return;
    trackIdxRef.current = newIdx;
    setTrackIdx(newIdx);
    const token = ++loadTokenRef.current;
    a.pause();
    a.src = PLAYLIST[newIdx].src;
    a.load();
    setProgress(0);
    if (autoplay) {
      const onCanPlay = () => {
        a.removeEventListener("canplay", onCanPlay);
        // 过期的加载回调或用户已暂停时不再播放
        if (token !== loadTokenRef.current || !isPlayingRef.current) return;
        a.play().catch((err: DOMException) => {
          // 自动播放被浏览器策略拒绝（NotAllowedError）时回滚 UI，避免假播放状态
          if (err?.name === "NotAllowedError") { isPlayingRef.current = false; setIsPlaying(false); }
        });
      };
      a.addEventListener("canplay", onCanPlay);
    }
  }, []);

  const prevTrack = useCallback(() => {
    loadTrack((trackIdxRef.current - 1 + PLAYLIST.length) % PLAYLIST.length, isPlayingRef.current);
  }, [loadTrack]);

  const nextTrack = useCallback(() => {
    loadTrack((trackIdxRef.current + 1) % PLAYLIST.length, isPlayingRef.current);
  }, [loadTrack]);

  // 频谱条渲染（内部具名循环，避免回调自引用）
  const drawSpectrum = useCallback(() => {
    const render = () => {
    const canvas = spectrumRef.current;
    const analyser = analyserRef.current;
    const container = containerRef.current;
    if (!canvas || !analyser || !container) { animRef.current = requestAnimationFrame(render); return; }

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    // 确保 canvas 尺寸和容器一致
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
    }

    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const w = W / dpr;
    const h = H / dpr;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.scale(dpr, dpr);

    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    analyser.getByteFrequencyData(data);

    const baseLight = isDark ? 85 : 15;
    const lightRange = isDark ? 15 : 20;
    const barW = 5; // 固定条宽

    // 左侧（从下往上）
    for (let i = 0; i < bufLen; i++) {
      const v = data[i] / 255;
      const bw = v * barW + 1;
      const segH = h / bufLen;
      ctx.fillStyle = `hsla(222, 25%, ${baseLight + v * lightRange}%, ${0.3 + v * 0.7})`;
      ctx.fillRect(0, i * segH, bw, segH);
    }
    // 右侧（从下往上）
    for (let i = 0; i < bufLen; i++) {
      const v = data[bufLen - 1 - i] / 255;
      const bw = v * barW + 1;
      const segH = h / bufLen;
      ctx.fillStyle = `hsla(222, 25%, ${baseLight + v * lightRange}%, ${0.3 + v * 0.7})`;
      ctx.fillRect(w - bw, i * segH, bw, segH);
    }
    // 顶部（从左往右）
    for (let i = 0; i < bufLen; i++) {
      const v = data[i] / 255;
      const bh = v * barW + 1;
      const segW = w / bufLen;
      ctx.fillStyle = `hsla(222, 25%, ${baseLight + v * lightRange}%, ${0.3 + v * 0.7})`;
      ctx.fillRect(i * segW, 0, segW, bh);
    }
    // 底部（从左往右，画在最底部，被控制栏 z-20 盖住后刚好贴在进度条上方）
    for (let i = 0; i < bufLen; i++) {
      const v = data[bufLen - 1 - i] / 255;
      const bh = v * barW + 1;
      const segW = w / bufLen;
      ctx.fillStyle = `hsla(222, 25%, ${baseLight + v * lightRange}%, ${0.3 + v * 0.7})`;
      ctx.fillRect(i * segW, h - bh, segW, bh);
    }

    ctx.restore();
    animRef.current = requestAnimationFrame(render);
    };

    render();
  }, [isDark]);

  // 频谱动画一直跑
  useEffect(() => {
    animRef.current = requestAnimationFrame(drawSpectrum);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawSpectrum]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (!started) { initAudio(); setStarted(true); }
    // play() 的 Promise 必须接住，否则快速切换时中断会抛出未捕获的 AbortError
    if (isPlaying) { audioRef.current.pause(); isPlayingRef.current = false; }
    else {
      // AudioContext 若被浏览器挂起，先唤醒再播，否则经 createMediaElementSource 接入后无声
      const ctx = analyserRef.current?.context;
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
      audioRef.current.play().catch((err: DOMException) => {
        // 自动播放被策略拒绝（NotAllowedError）时回滚 UI，用户再次点击即为有效手势
        if (err?.name === "NotAllowedError") setIsPlaying(false);
      });
      isPlayingRef.current = true;
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, started, initAudio]);

  // 初始音源 + 自动播放：挂载后尝试直接播放，被浏览器策略阻止则回滚 UI
  useEffect(() => {
    const a = audioRef.current;
    if (!a || a.src) return;
    a.src = PLAYLIST[0].src;
    a.load();
    initAudio();
    setStarted(true);
    isPlayingRef.current = true;
    setIsPlaying(true);
    const ctx = analyserRef.current?.context;
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    a.play().catch(() => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    });
  }, [initAudio]);

  // 进度
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onTime = () => { if (!isDragging) setProgress(a.currentTime); setDuration(a.duration || 0); };
    const onLoaded = () => setDuration(a.duration || 0);
    a.addEventListener("timeupdate", onTime); a.addEventListener("loadedmetadata", onLoaded);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onLoaded); };
  }, [isDragging]);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    // 用 ref 取当前曲目，修复手动切歌后闭包过期导致连播重复的问题
    const onEnd = () => loadTrack((trackIdxRef.current + 1) % PLAYLIST.length, true);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, [loadTrack]);

  // 进度条拖拽
  const progressRef = useRef<HTMLDivElement>(null);
  const seek = useCallback((clientX: number) => {
    const bar = progressRef.current; const a = audioRef.current;
    if (!bar || !a || !duration) return;
    const rect = bar.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * duration;
    setProgress(a.currentTime);
  }, [duration]);

  const onBarDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true); seek(e.clientX);
    const onMove = (ev: MouseEvent) => seek(ev.clientX);
    const onUp = () => { setIsDragging(false); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  }, [seek]);

  const fmt = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;

  return (
    <div ref={containerRef} className="relative size-full flex flex-col select-none">
      <audio ref={audioRef} preload="auto" />

      {/* 3D 魔方 */}
      <div className="relative flex-1 min-h-0">
        <Cube3D analyserRef={analyserRef} playing={isPlaying} className="absolute inset-0" />
      </div>

      {/* 频谱条覆盖整个容器 */}
      <canvas ref={spectrumRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* 底部控制 */}
      <div className="shrink-0 px-3 py-2 bg-background/70 backdrop-blur-sm border-t border-border/30 relative z-20">
        {/* 进度条 - 增大点击区域 */}
        <div ref={progressRef} className="relative h-3 w-full cursor-pointer group mb-1.5 flex items-center" onMouseDown={onBarDown}>
          {/* 轨道背景 */}
          <div className="w-full h-1.5 rounded-full bg-muted relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full rounded-full bg-primary transition-[width] duration-100" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
          </div>
          {/* 拖拽把手 */}
          <div
            className="absolute size-3 rounded-full bg-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: duration ? `calc(${(progress / duration) * 100}% - 6px)` : "0px", top: "50%", transform: "translateY(-50%)" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
          <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={prevTrack}>
            <SkipBack className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={toggle}>
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={nextTrack}>
            <SkipForward className="size-3.5" />
          </Button>
          <div className="flex flex-col min-w-0 ml-1">
            <span className="text-xs font-medium truncate">{PLAYLIST[trackIdx].title}</span>
            <span className="text-[10px] text-muted-foreground truncate">{trackIdx + 1} / {PLAYLIST.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
