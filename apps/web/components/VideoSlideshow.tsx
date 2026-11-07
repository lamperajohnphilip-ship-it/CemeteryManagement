'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './VideoSlideshow.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO SLIDES CONFIGURATION
// To add or change videos:
// 1. Place your video file (.mp4, .webm) into: apps/web/public/videos/
// 2. Set `videoUrl` below to '/videos/your-filename.mp4'
// 3. Optional: Set `posterUrl` to an image thumbnail in public/
// If `videoUrl` is empty (''), the component displays an elegant placeholder.
// ─────────────────────────────────────────────────────────────────────────────
export interface VideoSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl?: string; // Example: '/videos/cemetery-tour.mp4'
  posterUrl?: string; // Example: '/images/tour-poster.jpg'
}

export const DEFAULT_SLIDES: VideoSlide[] = [
  {
    id: 'memorial-tour',
    badge: 'MEMORIAL TOUR',
    title: 'Eternal Rest Memorial Grounds & Overview',
    subtitle: 'Municipality of Jasaan Cemetery Portal',
    description:
      'A scenic walk-through showcasing the grounds, serene garden sections, and sacred resting places of Eternal Rest.',
    videoUrl: '', // Ready for video file (leave empty for placeholder state)
    posterUrl: '',
  },
  {
    id: 'locator-guide',
    badge: 'LOCATOR GUIDE',
    title: 'Digital Grave Mapping & Navigation Tutorial',
    subtitle: 'Interactive Memorial Mapping',
    description:
      'Step-by-step guidance on locating deceased family members, navigating the plot grid, and finding gravesites.',
    videoUrl: '', // Ready for video file
    posterUrl: '',
  },
  {
    id: 'public-services',
    badge: 'VISITOR SERVICES',
    title: 'Public Inquiries, Plot Assistance & Services',
    subtitle: 'Guiding Families with Dignity',
    description:
      'Learn how to submit online inquiries, schedule burial services, and reach cemetery administrative personnel.',
    videoUrl: '', // Ready for video file
    posterUrl: '',
  },
];

interface VideoSlideshowProps {
  slides?: VideoSlide[];
}

export default function VideoSlideshow({ slides = DEFAULT_SLIDES }: VideoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const safeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const activeSlide: VideoSlide = safeSlides[currentIndex] ?? safeSlides[0] ?? DEFAULT_SLIDES[0]!;
  const hasVideo = Boolean(activeSlide.videoUrl && activeSlide.videoUrl.trim().length > 0);

  // Pause video and reset time whenever active slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? safeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === safeSlides.length - 1 ? 0 : prev + 1));
  };

  const togglePlay = () => {
    if (!hasVideo) {
      setToastMessage(
        'Video placeholder ready. Place your video in public/videos/ and set videoUrl in the slides config.'
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
      return;
    }

    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className={styles.section} id="video-tour" aria-label="Cemetery Video Tour">
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          MUNICIPALITY OF JASAAN · MEMORIAL SHOWCASE
        </div>
        <h2 className={styles.sectionTitle}>
          MEMORIAL <span className={styles.goldText}>VIDEO TOUR</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Experience the sacred grounds of Eternal Rest, navigate our memorial mapping, and explore cemetery services.
        </p>
      </div>

      {/* Main Slideshow Container */}
      <div className={styles.slideshowWrapper}>
        <div className={styles.playerContainer} ref={containerRef}>
          {hasVideo ? (
            /* Active Video Player */
            <div className={styles.videoInner}>
              <video
                ref={videoRef}
                src={activeSlide.videoUrl}
                poster={activeSlide.posterUrl || undefined}
                className={styles.videoElement}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                playsInline
                preload="metadata"
                onClick={togglePlay}
              />

              {/* Custom Playback Overlay Controls */}
              <div className={`${styles.videoControls} ${!isPlaying ? styles.controlsVisible : ''}`}>
                <div className={styles.progressRow}>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.progressBar}
                    aria-label="Video timeline"
                  />
                </div>

                <div className={styles.controlsBar}>
                  <div className={styles.controlsLeft}>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className={styles.controlBtn}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className={styles.controlBtn}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>

                    <span className={styles.timeDisplay}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className={styles.controlsRight}>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className={styles.controlBtn}
                      aria-label="Toggle Fullscreen"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Professional Placeholder State (Awaiting Video File) */
            <div className={styles.placeholderBox} onClick={togglePlay}>
              <div className={styles.placeholderBackdrop}>
                <div className={styles.ambientGlow} />
                <div className={styles.gridOverlay} />
              </div>

              {/* Decorative Corner Accents */}
              <div className={`${styles.corner} ${styles.cornerTL}`} />
              <div className={`${styles.corner} ${styles.cornerTR}`} />
              <div className={`${styles.corner} ${styles.cornerBL}`} />
              <div className={`${styles.corner} ${styles.cornerBR}`} />

              <div className={styles.placeholderContent}>
                <div className={styles.placeholderBadge}>
                  <span className={styles.badgePulse} />
                  {activeSlide.badge} · READY FOR VIDEO UPLOAD
                </div>

                <div className={styles.playButtonWrapper}>
                  <button
                    type="button"
                    className={styles.playButton}
                    aria-label={`Play preview for ${activeSlide.title}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </button>
                  <div className={styles.playRing} />
                </div>

                <h3 className={styles.placeholderTitle}>{activeSlide.title}</h3>
                <p className={styles.placeholderSubtitle}>{activeSlide.subtitle}</p>

                <div className={styles.integrationHint}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.hintIcon}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Video file can be placed in <code>public/videos/</code> and configured in <code>DEFAULT_SLIDES</code></span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows (Prev / Next) */}
          {safeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className={`${styles.navArrow} ${styles.navArrowPrev}`}
                aria-label="Previous video slide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className={`${styles.navArrow} ${styles.navArrowNext}`}
                aria-label="Next video slide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Counter Overlay */}
          <div className={styles.slideCounter}>
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className={styles.counterDivider}>/</span>
            <span>{String(safeSlides.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Slide Info & Caption Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoLeft}>
            <span className={styles.infoBadge}>{activeSlide.badge}</span>
            <h3 className={styles.infoTitle}>{activeSlide.title}</h3>
            <p className={styles.infoDescription}>{activeSlide.description}</p>
          </div>

          {/* Slide Pagination Dots */}
          {safeSlides.length > 1 && (
            <div className={styles.paginationDots} role="tablist" aria-label="Slideshow selection">
              {safeSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  aria-selected={idx === currentIndex}
                  role="tab"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Temporary Toast Notice */}
      {showToast && (
        <div className={styles.toastNotice} role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.toastIcon}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4m0-4h.01" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}

