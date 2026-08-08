import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

type PeelPosterCanvasProps = {
  imageSrc: string;
  width: number;
  height: number;
  interactionMode?: 'pointer' | 'touch';
  playInitialCue?: boolean;
  completionThreshold?: number;
  completionVelocity?: number;
  autoPeel?: boolean;
  autoPeelDelay?: number;
  autoPeelDuration?: number;
  onInitialCueComplete?: () => void;
  onComplete: () => void;
  onPeelingChange: (isPeeling: boolean) => void;
};

type PeelMeshProps = {
  imageSrc: string;
  width: number;
  height: number;
  progress: number;
  grabY: number;
  pullY: number;
};

const vertexShader = `
  uniform float uProgress;
  uniform float uWidth;
  uniform float uGrabY;
  uniform float uPullY;

  varying vec2 vUv;
  varying float vCurl;
  varying float vFoldDistance;

  void main() {
    vUv = uv;

    vec3 transformed = position;
    float progress = clamp(uProgress, 0.0, 1.2);
    float left = -uWidth * 0.5;
    float diagonal = (uv.y - uGrabY) * uWidth * 0.52 * progress;
    float fold = left + progress * uWidth * 1.16 + diagonal;
    float earlyRadius = mix(0.032, 0.1, smoothstep(0.0, 0.52, progress));
    float radius = uWidth * mix(
      earlyRadius,
      0.34,
      smoothstep(0.52, 1.12, progress)
    );
    float distanceToFold = fold - position.x;

    vCurl = 0.0;
    vFoldDistance = abs(distanceToFold);

    if (distanceToFold > 0.0 && progress > 0.001) {
      float arcLength = 3.14159265 * radius;
      float angle = min(distanceToFold / radius, 3.14159265);

      transformed.x = fold - sin(angle) * radius;
      transformed.z = (1.0 - cos(angle)) * radius;
      vCurl = sin(angle);

      if (distanceToFold > arcLength) {
        transformed.x = fold + (distanceToFold - arcLength);
        transformed.z = radius * 2.0;
        vCurl = 0.0;
      }

      float handInfluence = 1.0 - smoothstep(0.0, 0.72, abs(uv.y - uGrabY));
      float freeEdge = pow(1.0 - uv.x, 5.0);
      float endRound =
        1.0 - smoothstep(0.0, 0.18, uv.y) +
        smoothstep(0.82, 1.0, uv.y);
      float centerBow = sin(uv.y * 3.14159265);
      float grabDirection = (uGrabY - 0.5) * 2.0;

      transformed.x += freeEdge * progress * uWidth *
        (endRound * 0.065 - centerBow * 0.045);
      transformed.y += freeEdge * progress * uWidth *
        (
          -(1.0 - smoothstep(0.0, 0.2, uv.y)) * 0.105 +
          smoothstep(0.8, 1.0, uv.y) * 0.035 +
          grabDirection * centerBow * 0.035
        );
      transformed.y += freeEdge * uPullY * uWidth *
        mix(0.28, 0.72, handInfluence) *
        smoothstep(0.02, 0.48, progress);
      transformed.z += freeEdge * handInfluence * radius * 0.22;
      transformed.z += handInfluence * radius * 0.075 *
        sin(uv.y * 8.0 + progress * 3.0);
    }

    float exitProgress = smoothstep(0.68, 1.05, progress);
    float downwardExit = clamp(-uPullY * 1.65, 0.0, 1.0);
    transformed.x += uWidth * exitProgress * mix(0.62, 0.3, downwardExit);
    transformed.y -= uWidth * exitProgress * downwardExit * 0.78;
    transformed.z += uWidth * exitProgress * 0.055;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uWidth;
  uniform float uProgress;

  varying vec2 vUv;
  varying float vCurl;
  varying float vFoldDistance;

  void main() {
    vec4 artwork = texture2D(uTexture, vUv);
    float foldShade = 1.0 - smoothstep(0.0, uWidth * 0.24, vFoldDistance);
    float curvedShade = clamp(vCurl * 0.17 + foldShade * 0.055, 0.0, 0.22);
    float exitAlpha = 1.0 - smoothstep(0.78, 1.05, uProgress);

    if (gl_FrontFacing) {
      vec3 front = artwork.rgb * (1.0 - curvedShade);
      gl_FragColor = vec4(front, artwork.a * exitAlpha);
    } else {
      float paperShade = 1.0 - curvedShade * 0.48;
      float warmEdge = smoothstep(0.0, 0.85, vUv.x) * 0.012;
      gl_FragColor = vec4(
        vec3(paperShade, paperShade - warmEdge, paperShade - warmEdge),
        exitAlpha
      );
    }
  }
`;

function PeelMesh({
  imageSrc,
  width,
  height,
  progress,
  grabY,
  pullY
}: PeelMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const loadedTexture = useLoader(THREE.TextureLoader, imageSrc);
  const { gl } = useThree();
  const texture = useMemo(() => {
    const nextTexture = loadedTexture.clone();
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [gl, loadedTexture]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(() => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uProgress.value = progress;
    materialRef.current.uniforms.uGrabY.value = grabY;
    materialRef.current.uniforms.uPullY.value = pullY;
  });

  return (
    <mesh>
      <planeGeometry args={[width, height, 72, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        transparent
        uniforms={{
          uTexture: { value: texture },
          uProgress: { value: progress },
          uWidth: { value: width },
          uGrabY: { value: grabY },
          uPullY: { value: pullY }
        }}
      />
    </mesh>
  );
}

export function PeelPosterCanvas({
  imageSrc,
  width,
  height,
  interactionMode = 'pointer',
  playInitialCue = false,
  completionThreshold = 0.42,
  completionVelocity = Number.POSITIVE_INFINITY,
  autoPeel = false,
  autoPeelDelay = 4800,
  autoPeelDuration = 1.25,
  onInitialCueComplete,
  onComplete,
  onPeelingChange
}: PeelPosterCanvasProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const cueDelayRef = useRef<gsap.core.Tween | null>(null);
  const hoveringEdgeRef = useRef(false);
  const suppressHoverUntilLeaveRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isCompletingGestureRef = useRef(false);
  const isAutoPeelingRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onInitialCueCompleteRef = useRef(onInitialCueComplete);
  const onPeelingChangeRef = useRef(onPeelingChange);
  const gestureStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const progressRef = useRef(0);
  const [progressState, setProgressState] = useState({
    imageSrc,
    value: 0
  });
  const [grabY, setGrabY] = useState(0.28);
  const [pullY, setPullY] = useState(0);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => document.visibilityState === 'visible'
  );
  const [isSurfaceVisible, setIsSurfaceVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const progress =
    progressState.imageSrc === imageSrc ? progressState.value : 0;
  const updateProgress = useCallback(
    (value: number) => {
      progressRef.current = value;
      setProgressState({ imageSrc, value });
    },
    [imageSrc]
  );
  const cancelAutoPeel = useCallback(() => {
    if (!isAutoPeelingRef.current) return;

    tweenRef.current?.kill();
    isAutoPeelingRef.current = false;
    isCompletingGestureRef.current = false;
    updateProgress(0);
    setPullY(0);
    onPeelingChangeRef.current(false);
  }, [updateProgress]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onInitialCueCompleteRef.current = onInitialCueComplete;
    onPeelingChangeRef.current = onPeelingChange;
  }, [onComplete, onInitialCueComplete, onPeelingChange]);

  const readPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const bounds = surfaceRef.current?.getBoundingClientRect();

      if (!bounds) {
        return { x: 0, y: 0 };
      }

      return {
        x: THREE.MathUtils.clamp(
          (event.clientX - bounds.left) / bounds.width,
          0,
          1.16
        ),
        y: THREE.MathUtils.clamp(
          1 - (event.clientY - bounds.top) / bounds.height,
          0,
          1
        )
      };
    },
    []
  );

  const animateProgress = useCallback(
    (target: number, onAnimationComplete?: () => void, duration?: number) => {
      tweenRef.current?.kill();

      if (prefersReducedMotion) {
        updateProgress(target);
        onAnimationComplete?.();
        return;
      }

      const state = { value: progressRef.current };

      tweenRef.current = gsap.to(state, {
        value: target,
        duration: duration ?? (target > progressRef.current ? 0.62 : 0.72),
        ease: target > progressRef.current ? 'power3.inOut' : 'power3.out',
        onUpdate: () => updateProgress(state.value),
        onComplete: onAnimationComplete
      });
    },
    [prefersReducedMotion, updateProgress]
  );

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      tweenRef.current?.kill();
      cueDelayRef.current?.kill();
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsDocumentVisible(isVisible);
      if (!isVisible) cancelAutoPeel();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cancelAutoPeel]);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSurfaceVisible(entry.isIntersecting);
        if (!entry.isIntersecting) cancelAutoPeel();
      },
      { threshold: 0.12 }
    );

    observer.observe(surface);
    return () => observer.disconnect();
  }, [cancelAutoPeel]);

  useEffect(() => {
    if (!playInitialCue || prefersReducedMotion) return;

    cueDelayRef.current?.kill();
    cueDelayRef.current = gsap.delayedCall(1.45, () => {
      onPeelingChange(true);
      animateProgress(0.065, () => {
        cueDelayRef.current = gsap.delayedCall(0.32, () => {
          animateProgress(0, () => {
            onPeelingChange(false);
            onInitialCueComplete?.();
          });
        });
      });
    });

    return () => {
      cueDelayRef.current?.kill();
    };
  }, [
    animateProgress,
    onInitialCueComplete,
    onPeelingChange,
    playInitialCue,
    prefersReducedMotion
  ]);

  useEffect(() => {
    tweenRef.current?.kill();
    progressRef.current = 0;
    hoveringEdgeRef.current = false;
    suppressHoverUntilLeaveRef.current = true;
    isDraggingRef.current = false;
    isCompletingGestureRef.current = false;
    isAutoPeelingRef.current = false;
    gestureStartRef.current = null;
  }, [imageSrc]);

  useEffect(() => {
    if (!autoPeel || !isDocumentVisible || !isSurfaceVisible) return;

    let timeoutId: number;
    let cancelled = false;

    const schedulePeel = (delay: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        if (isDraggingRef.current || isCompletingGestureRef.current) {
          schedulePeel(1200);
          return;
        }

        const timeSinceInteraction = performance.now() - lastInteractionRef.current;
        if (timeSinceInteraction < 3000) {
          schedulePeel(3000 - timeSinceInteraction);
          return;
        }

        cueDelayRef.current?.kill();
        onInitialCueCompleteRef.current?.();
        hoveringEdgeRef.current = false;
        suppressHoverUntilLeaveRef.current = true;
        isCompletingGestureRef.current = true;
        isAutoPeelingRef.current = true;
        setGrabY(0.82);
        setPullY(0);
        onPeelingChangeRef.current(true);
        tweenRef.current?.kill();

        if (prefersReducedMotion) {
          updateProgress(1.16);
          isAutoPeelingRef.current = false;
          onCompleteRef.current();
          onPeelingChangeRef.current(false);
          return;
        }

        const state = { progress: 0, pullY: 0 };
        tweenRef.current = gsap.to(state, {
          progress: 1.16,
          pullY: -0.32,
          duration: autoPeelDuration,
          ease: 'power2.inOut',
          onUpdate: () => {
            updateProgress(state.progress);
            setPullY(state.pullY);
          },
          onComplete: () => {
            if (cancelled) return;
            isAutoPeelingRef.current = false;
            onCompleteRef.current();
            onPeelingChangeRef.current(false);
          }
        });
      }, delay);
    };

    schedulePeel(autoPeelDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    autoPeel,
    autoPeelDelay,
    autoPeelDuration,
    imageSrc,
    isDocumentVisible,
    isSurfaceVisible,
    prefersReducedMotion,
    updateProgress
  ]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCompletingGestureRef.current) {
      return;
    }

    const pointer = readPointer(event);

    if (pointer.x > 0.34) {
      return;
    }

    cueDelayRef.current?.kill();
    lastInteractionRef.current = performance.now();
    onInitialCueComplete?.();
    tweenRef.current?.kill();
    hoveringEdgeRef.current = false;
    suppressHoverUntilLeaveRef.current = false;
    const keyboardRegion = event.currentTarget.closest<HTMLElement>(
      '.home-poster-stage, .home-mobile-poster-showcase'
    );
    keyboardRegion?.blur();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events used by visual regression tools have no
      // native pointer to capture; the gesture can still be inspected.
    }
    setGrabY(pointer.y);
    gestureStartRef.current = {
      x: pointer.x,
      y: pointer.y,
      time: performance.now()
    };
    setPullY(0);
    updateProgress(Math.max(0.025, pointer.x * 0.92));
    isDraggingRef.current = true;
    onPeelingChange(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCompletingGestureRef.current) {
      return;
    }

    const pointer = readPointer(event);

    if (!isDraggingRef.current) {
      if (prefersReducedMotion) {
        return;
      }

      if (suppressHoverUntilLeaveRef.current) {
        return;
      }

      if (pointer.x <= 0.12) {
        setGrabY(pointer.y);

        if (!hoveringEdgeRef.current) {
          hoveringEdgeRef.current = true;
          animateProgress(0.055);
        }
      } else if (hoveringEdgeRef.current) {
        hoveringEdgeRef.current = false;
        animateProgress(0);
      }

      return;
    }

    const gestureStart = gestureStartRef.current;
    const downwardPull = gestureStart
      ? Math.max(0, gestureStart.y - pointer.y) * (height / width)
      : 0;
    const peelDistance = Math.hypot(pointer.x, downwardPull);

    updateProgress(THREE.MathUtils.clamp(peelDistance, 0, 1.16));
    setPullY(
      gestureStart
        ? THREE.MathUtils.clamp(pointer.y - gestureStart.y, -0.75, 0.75)
        : 0
    );
    setGrabY(
      (currentGrabY) => currentGrabY + (pointer.y - currentGrabY) * 0.08
    );
  };

  const handlePointerLeave = () => {
    suppressHoverUntilLeaveRef.current = false;

    if (
      isCompletingGestureRef.current ||
      isDraggingRef.current ||
      !hoveringEdgeRef.current
    ) {
      return;
    }

    hoveringEdgeRef.current = false;
    animateProgress(0);
  };

  const finishGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const keyboardRegion = event.currentTarget.closest<HTMLElement>(
      '.home-poster-stage, .home-mobile-poster-showcase'
    );
    window.setTimeout(() => keyboardRegion?.blur(), 0);
    isDraggingRef.current = false;
    lastInteractionRef.current = performance.now();

    const gestureStart = gestureStartRef.current;
    const elapsedSeconds = gestureStart
      ? Math.max((performance.now() - gestureStart.time) / 1000, 0.001)
      : Number.POSITIVE_INFINITY;
    const outwardVelocity = gestureStart
      ? (progressRef.current - gestureStart.x) / elapsedSeconds
      : 0;
    const hasIntentionalVelocity =
      progressRef.current >= 0.16 && outwardVelocity >= completionVelocity;

    gestureStartRef.current = null;

    if (progressRef.current >= completionThreshold || hasIntentionalVelocity) {
      isCompletingGestureRef.current = true;
      animateProgress(1.16, () => {
        onComplete();
        onPeelingChange(false);
      });
      return;
    }

    animateProgress(0, () => {
      setPullY(0);
      onPeelingChange(false);
    });
  };

  return (
    <div
      ref={surfaceRef}
      className={`home-poster-peel-surface${
        progress > 0.001 ? ' is-rendering-peel' : ''
      }${interactionMode === 'touch' ? ' home-poster-peel-surface--touch' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={finishGesture}
      onPointerCancel={finishGesture}
    >
      <Canvas
        tabIndex={-1}
        orthographic
        camera={{ position: [0, 0, 1000], zoom: 1 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <PeelMesh
          imageSrc={imageSrc}
          width={width}
          height={height}
          progress={progress}
          grabY={grabY}
          pullY={pullY}
        />
      </Canvas>
    </div>
  );
}
