import React, { useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplashScreen } from './components/SplashScreen';
import { Mail, Instagram, Linkedin } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface VideoPlayerProps {
  src?: string;
  title: string;
  isShowreel?: boolean;
}

function VideoPlayer({ src, title, isShowreel = false }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false); 
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (src) {
    return (
      <div 
        ref={containerRef}
        className={`relative group cursor-pointer aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen' 
            : 'hover:shadow-xl hover:scale-105'
        }`}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay={false}
          muted={false}
          loop
          playsInline
          className={`w-full h-full object-contain transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'} ${
            isFullscreen ? 'object-contain' : 'object-cover'
          }`}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 1; // Set thumbnail to 1 second
            }
          }}
        />
        
        {/* Thumbnail overlay */}
        {showThumbnail && (
          <div className="absolute inset-0">
            <div
              className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
              style={{ backgroundColor: '#374151' }}
            />
          </div>
        )}
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
              isFullscreen ? 'w-24 h-24' : 'w-16 h-16'
            }`}>
              <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-1 ${
                isFullscreen 
                  ? 'border-l-[30px] border-t-[18px] border-b-[18px]' 
                  : 'border-l-[20px] border-t-[12px] border-b-[12px]'
              }`}></div>
            </div>
          </div>
        )}
        {!isFullscreen && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isFullscreen 
              ? 'top-8 right-8 w-12 h-12 opacity-100' 
              : 'top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isFullscreen ? (
            <X size={20} className="text-white" />
          ) : (
            <Maximize2 size={16} className="text-white" />
          )}
        </button>
        <div className={`absolute transition-all duration-300 ${
          isFullscreen 
            ? 'bottom-8 left-8 opacity-100' 
            : 'bottom-4 left-4 opacity-0 group-hover:opacity-100'
        }`}>
          <span className={`text-white font-bosenAlt bg-black/50 px-3 py-1 rounded-full ${
            isFullscreen ? 'text-lg' : 'text-sm'
          }`}>
            {title}
          </span>
        </div>
      </div>
    );
  }


  // Placeholder for videos without src
  return (
    <div 
      ref={containerRef}
      className={`relative group cursor-pointer aspect-video rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen' 
          : 'hover:shadow-xl hover:scale-105'
      }`}
      onClick={handleVideoClick}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className={`mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center ${
            isFullscreen ? 'w-24 h-24' : 'w-12 h-12'
          }`}>
            <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-1 ${
              isFullscreen 
                ? 'border-l-[20px] border-t-[12px] border-b-[12px]' 
                : 'border-l-[10px] border-t-[6px] border-b-[6px]'
            }`}></div>
          </div>
          <span className={`text-white/60 font-bosenAlt ${isFullscreen ? 'text-xl' : 'text-sm'}`}>{title}</span>
        </div>
      </div>
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen 
            ? 'top-8 right-8 w-12 h-12 opacity-100' 
            : 'top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={16} className="text-white" />
        )}
      </button>
    </div>
  );
}

function VerticalVideoPlayer({ title }: { title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen' 
          : 'hover:shadow-xl hover:scale-105'
      }`}
      onClick={handleVideoClick}
    >
      {/* Video element (hidden initially) */}
      <video
        ref={videoRef}
        autoPlay={false}
        muted={false}
        loop
        playsInline
        className={`w-full h-full transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'} ${
          isFullscreen ? 'object-contain' : 'object-cover'
        }`}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 1; // Set thumbnail to 1 second
          }
        }}
      />
      
      {/* Thumbnail overlay */}
      {showThumbnail && (
        <div className="absolute inset-0">
          <div
            className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
            style={{ backgroundColor: '#374151' }}
          />
        </div>
      )}
      
      {/* Fallback placeholder when no video */}
      {!videoRef.current?.src && (
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className={`mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center ${
              isFullscreen ? 'w-16 h-16' : 'w-8 h-8'
            }`}>
              <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-0.5 ${
                isFullscreen 
                  ? 'border-l-[16px] border-t-[8px] border-b-[8px]' 
                  : 'border-l-[8px] border-t-[4px] border-b-[4px]'
              }`}></div>
            </div>
            <span className={`text-white/60 font-bosenAlt ${isFullscreen ? 'text-lg' : 'text-xs'}`}>{title}</span>
          </div>
        </div>
      )}
      
      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 ">
          <div className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
            isFullscreen ? 'w-20 h-20' : 'w-12 h-12'
          }`}>
            <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-0.5 ${
              isFullscreen 
                ? 'border-l-[24px] border-t-[14px] border-b-[14px]' 
                : 'border-l-[12px] border-t-[8px] border-b-[8px]'
            }`}></div>
          </div>
        </div>
      )}
      
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen 
            ? 'top-8 right-8 w-12 h-12 opacity-100' 
            : 'top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className={`absolute transition-all duration-300 ${
        isFullscreen 
          ? 'bottom-8 left-8 opacity-100' 
          : 'bottom-2 left-2 opacity-0 group-hover:opacity-100'
      }`}>
        <span className={`text-white font-bosenAlt bg-black/50 px-2 py-1 rounded-full ${
          isFullscreen ? 'text-base' : 'text-xs'
        }`}>
          {title}
        </span>
      </div>
    </div>
  );
}

function VerticalVideoPlayerWithSrc({ src, title }: { src: string; title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen' 
          : 'hover:shadow-xl hover:scale-105'
      }`}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={false}
        muted={false}
        loop
        playsInline
        className={`w-full h-full transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'} ${
          isFullscreen ? 'object-contain' : 'object-cover'
        }`}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 1; // Set thumbnail to 1 second
          }
        }}
      />
      
      {/* Thumbnail overlay */}
      {showThumbnail && (
        <div className="absolute inset-0">
          <div
            className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
            style={{ backgroundColor: '#374151' }}
          />
        </div>
      )}
      
      {/* Play button overlay */}
      {!isPlaying && ( 
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 ">
          <div className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
            isFullscreen ? 'w-20 h-20' : 'w-12 h-12'
          }`}>
            <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-0.5 ${
              isFullscreen 
                ? 'border-l-[24px] border-t-[14px] border-b-[14px]' 
                : 'border-l-[12px] border-t-[8px] border-b-[8px]'
            }`}></div>
          </div>
          </div>
      
      )}
      
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen 
            ? 'top-8 right-8 w-12 h-12 opacity-100' 
            : 'top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className={`absolute transition-all duration-300 ${
        isFullscreen 
          ? 'bottom-8 left-8 opacity-100' 
          : 'bottom-2 left-2 opacity-0 group-hover:opacity-100'
      }`}>
        <span className={`text-white font-bosenAlt bg-black/50 px-2 py-1 rounded-full ${
          isFullscreen ? 'text-base' : 'text-xs'
        }`}>
          {title}
        </span>
      </div>
    </div>
  );
}

function VerticalVideoPlayerPlaceholder({ title }: { title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] !rounded-none !aspect-auto w-screen h-screen' 
          : 'hover:shadow-xl hover:scale-105'
      }`}
    >
      <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className={`mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center ${
            isFullscreen ? 'w-16 h-16' : 'w-8 h-8'
          }`}>
            <div className={`w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-0.5 ${
              isFullscreen 
                ? 'border-l-[16px] border-t-[8px] border-b-[8px]' 
                : 'border-l-[8px] border-t-[4px] border-b-[4px]'
            }`}></div>
          </div>
          <span className={`text-white/60 font-bosenAlt ${isFullscreen ? 'text-lg' : 'text-xs'}`}>{title}</span>
        </div>
      </div>
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`absolute bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
          isFullscreen 
            ? 'top-8 right-8 w-12 h-12 opacity-100' 
            : 'top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isFullscreen ? (
          <X size={20} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className={`absolute transition-all duration-300 ${
        isFullscreen 
          ? 'bottom-8 left-8 opacity-100' 
          : 'bottom-2 left-2 opacity-0 group-hover:opacity-100'
      }`}>
        <span className={`text-white font-bosenAlt bg-black/50 px-2 py-1 rounded-full ${
          isFullscreen ? 'text-base' : 'text-xs'
        }`}>
          {title}
        </span>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showContact, setShowContact] = React.useState(false);
  const [showportrait, setShowportrait] = React.useState(true);
  const [showbase, setShowbase] = React.useState(true);
  const [showeyes, setShoweyes] = React.useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const fixedBackgroundRef = useRef<HTMLDivElement>(null); 
  const portfolioRef = useRef<HTMLDivElement>(null);
  
  // Simplified mouse tracking
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  // Handle splash screen completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Simplified mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.registerPlugin(ScrollTrigger);

    // Simplified scroll animations
    gsap.to(mainTextRef.current, {
      y: 700,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "top+=1000",
        scrub: 2
      }
    });

    if (backgroundTextRef.current) {
      gsap.to(backgroundTextRef.current, {
        y: -300,
        opacity: 1,
        scaleY: 2.5,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "bottom bottom",
          end: "bottom+=-50 top",
          scrub: 1
        }
      });
    }

    if (portfolioSectionRef.current) {
      gsap.to(portfolioSectionRef.current, {
        y: -900,
        scrollTrigger: {
          trigger: portfolioSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
    }

    // Visibility triggers
    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "center bottom",
      onEnter: () => setShowContact(true),
      onLeaveBack: () => setShowContact(false),
    });

    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "center bottom",
      onEnter: () => setShowbase(false),
      onLeaveBack: () => setShowbase(true),
    });

    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "center 10%",
      onEnter: () => setShowportrait(false),
      onLeaveBack: () => setShowportrait(true),
    });

    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "center bottom",
      onEnter: () => setShoweyes(false),
      onLeaveBack: () => setShoweyes(true),
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
 
  return ( 
    <div className="relative">
     
       
      {/* Splash Screen */}
      {isLoading && <SplashScreen onLoadComplete={handleLoadComplete} />}

      <div
        ref={fixedBackgroundRef}
        className="fixed inset-0 bg-center bg-no-repeat z-[-1] bg-cover"
        style={{
          backgroundImage: `url('/bg.png')`,
          willChange: 'transform'
        }}
      />
 
      {/* Main Hero Section */} 
      <div 
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden bg-transparent"
      >

        {/* Base */}
        <div
          ref={baseRef}
          className={`fixed inset-0 flex items-center justify-center z-20 transition-opacity duration-300`}
          style={{
            top: "24%",
            left: "1%",
            opacity: showbase ? 1 : 0,
            pointerEvents: showbase ? "auto" : "none",
            willChange: 'transform, opacity'
          }}
        >
          <div className="relative">
            <div className="w-[35rem] h-[35rem] sm:w-[600px] sm:h-[600px] md:w-[50rem] md:h-[50rem] lg:w-[62.5rem] lg:h-[62.5rem] overflow-hidden">
              <img
                src="/base.png"
                alt="Base"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.05)" }}
              />
            </div>
          </div>
        </div>

        {/* Portrait */}
        <div
          ref={portraitRef}
          className={`fixed inset-0 flex items-center justify-center z-40 transition-opacity duration-300`}
          style={{
            top: "24%",
            left: "1%",
            opacity: showportrait ? 1 : 0,
            pointerEvents: showportrait ? "auto" : "none",
            willChange: 'transform, opacity'
          }}
        >
          <div className="relative">
            <div className="w-[35rem] h-[35rem] sm:w-[600px] sm:h-[600px] md:w-[50rem] md:h-[50rem] lg:w-[62.5rem] lg:h-[62.5rem] overflow-hidden">
              <img
                src="/me.png"
                alt="Portrait"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.05)" }}
              />
            </div>
          </div>
        </div>

        {/* Eyes */}
        <div
          ref={eyesRef}
          className={`fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-300`}
          style={{
            top: "24%",
            left: "1%",
            opacity: showeyes ? 1 : 0,
            pointerEvents: showeyes ? "auto" : "none",
            transform: `translate(${mousePosition.x * 4}px, ${mousePosition.y * 4}px)`,
            willChange: 'transform, opacity'
          }}
        >
          <div className="relative">
            <div className="w-[35rem] h-[35rem] sm:w-[600px] sm:h-[600px] md:w-[50rem] md:h-[50rem] lg:w-[62.5rem] lg:h-[62.5rem] overflow-hidden grayscale contrast-110 brightness-90">
              <img
                src="/eyes.png"
                alt="Eyes"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.05)" }}
              />
            </div>
          </div>
        </div>
        
        {/* Background Text - Aamir Naqvi at Bottom */}
        <div 
          ref={backgroundTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ 
            top: '65%',
            willChange: 'transform'
          }}
        >
          <div  
            className="text-[4rem] md:text-[10rem] lg:text-[20rem] font-bosenAlt text-black/50 select-none leading-none opacity-0"
            style={{
              animation: 'fade-in-delayed 1.2s ease-out 0.1s forwards',
              textShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            AAMIR NAQVI
          </div>
        </div>
        
        {/* Main Typography */}
        <div 
          ref={mainTextRef}
          className="absolute inset-0 flex items-center justify-center z-40"
          style={{ top: '60%', left: '-1%', willChange: 'transform' }}
        >
          <div className="text-center z-10 px-6">
            <div 
              className="text-2xl md:text-4xl lg:text-5xl font-bosenAlt tracking-tight text-white/70 leading-tight opacity-0"
              style={{ 
                animation: 'fade-in-delayed 1.2s ease-out 0.8s forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              I EDIT
            </div>
            <div 
              className="text-2xl md:text-3xl lg:text-4xl font-bosenAlt tracking-tight text-white/60 leading-tight mt-2 opacity-0"
              style={{ 
                animation: 'fade-in-delayed 1.2s ease-out 1.1s forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              VISUALS THAT
            </div>
            <div 
              className="text-2xl md:text-4xl lg:text-5xl font-bosenAlt tracking-tight text-white/90 leading-tight mt-2 opacity-0"
              style={{ 
                animation: 'fade-in-delayed 1.2s ease-out 1.4s forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              BUILD BRANDS
            </div>
          </div>
        </div>

        {/* Bottom Triangle Shape */}
        <div 
          ref={triangleRef}
          className="absolute bottom-4 left-[48%] max-sm:left-[40%] transform -translate-x-1/2 opacity-0 z-40 cursor-pointer"
          onClick={() => {
            document.getElementById('contact-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          style={{ 
            animation: 'fade-in-delayed 1.2s ease-out 3.5s forwards',
            filter: 'drop-shadow(0 10px 20px rgba(34, 211, 238, 0.3))'
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-cyan-400" />
            <p className="text-white/60 text-xs font-bosenAlt mt-2 uppercase tracking-wide">
              Scroll Down
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div 
        ref={portfolioSectionRef} 
        className="relative min-h-screen w-full bg-white z-[100] rounded-t-[3rem] rounded-b-[3rem] opacity-100"
        style={{ zIndex: 9999, willChange: 'transform' }}
      >
        
        <div className="container mx-auto px-6 py-20">
          <div className="relative text-center mb-16 z-20">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bosenAlt text-black/90 mb-6 tracking-tight">
              PORTFOLIO
            </h2>
            <p className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto leading-relaxed">
              Visual stories that shape brands and captivate audiences worldwide
            </p>
          </div>
          
          {/* Show Reel Section */}
          <div className="relative mb-20 z-20">
            <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
              SHOW REEL
            </h3>
            <div className="max-w-4xl mx-auto">
              <VideoPlayer 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                title="SHOW REEL"
                isShowreel={true}
              />
            </div>
          </div>

          {/* 3x3 Grid of 16:9 Videos */}
          <div className="relative mb-20 z-30">
            <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
              FEATURED WORK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[
                "https://ia600904.us.archive.org/35/items/portfolio_202508/Outworking%20everyone%20isn%E2%80%99t%20that%20hard%20v1.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/What%20is%20the%20most%20normal%20episode%20of%20Family%20Guy%20v3.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/Never%20running%20out%20of%20things%20to%20say%20is%20easy%2C%20actually%20isn%27t%C2%A0that%C2%A0hard%20v1.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/sample1_V1.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/The%20entire%20history%20of%20Thomas%20Shelby%20v2_1.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/WOLF%27S%20LAIR%20WHAT%20AI%20FOUND%20IN%20THIS%20HIDDEN%20NAZI%20BUNKER%20FROM%20WORLD%20WAR%20II%20IS%20TERRIFYING.mp4",
                "https://ia800906.us.archive.org/16/items/flirting-with-women-isnt-that-hard-v-1/Flirting%20with%20women%20isn%27t%20that%20hard%20v1.mp4",
                "https://ia600904.us.archive.org/35/items/portfolio_202508/Young%20Actresses%20Who%20Tragically%20Passed%20Away.mp4",
                "https://ia601002.us.archive.org/33/items/sample-1-1/sample1%20%281%29.mp4",
              ].map((url, i) => (
                <VideoPlayer
                  key={i}
                  src={url}
                  title={`PROJECT ${String(i + 1).padStart(2, "0")}`}
                  isShowreel={false}
                />
              ))}
            </div>
          </div>

          {/* 6x4 Grid of 9:16 Videos */}
          <div className="relative mb-20 z-30">
            <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
              SOCIAL CONTENT
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              ].map((url, i) => (
                <VerticalVideoPlayerWithSrc
                  key={i}
                  src={url}
                  title={`SOCIAL ${String(i + 1).padStart(2, "0")}`}
                />
              ))}
            </div> 
          </div>
        </div>
      </div>

      {/* Contact Section */}
      {showContact && (
        <div
          id="contact-section"
          className="fixed bottom-0 left-0 right-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center z-30 bg-transparent opacity-0"
          style={{
            animation: 'fade-in-delayed 1.2s ease-out 0.2s forwards'
          }}
        > 
          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-bosenAlt text-white/80 text-center mb-0 tracking-wide">
            LET'S START A CONVERSATION
          </h2>

          {/* Subheading */}
          <p className="text-white/30 text-1xl md:text-4xl lg:text-4xl ibm-font mb-8 text-center">
            Drop me a message, let's make something users will love.
          </p>

          <div className="space-y-10 text-center">
            {/* Email */}
            <div className="flex flex-col items-center gap-2">
              <Mail className="text-white/70 w-8 h-8" />
              <a
                href="https://mail.google.com/mail/?view=cm&to=broskiagency@gmail.com" target="_blank"
                className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                BROSKIAGENCY@GMAIL.COM
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                Let's create something that actually works.
              </p>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center gap-0">
              <Linkedin className="text-white/70 w-8 h-8" />
              <a
                href="https://www.linkedin.com/in/aamir-naqvi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                LINKEDIN
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                See how UX meets business - connect with me.
              </p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center gap-2">
              <Instagram className="text-white/70 w-8 h-8" />
              <a
                href="https://www.instagram.com/aamir.naqvii/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                INSTAGRAM
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                Tap in for visuals with purpose. - follow the flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;