'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject
} from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BeachIcon, SunsetIcon } from '@hugeicons/core-free-icons';

// ==========================================
// 1. GLASS SURFACE COMPONENT (Liquid Glass)
// ==========================================
export type GlassSurfaceChannel = 'R' | 'G' | 'B';
export type GlassSurfaceRenderer = 'auto' | 'svg' | 'webgl';
export type GlassSurfaceBackdrop = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

interface GlassSettings {
  backdrop?: RefObject<GlassSurfaceBackdrop | null> | GlassSurfaceBackdrop | null;
  displace: number;
  saturation: number;
  distortionScale: number;
  redOffset: number;
  greenOffset: number;
  blueOffset: number;
  xChannel: GlassSurfaceChannel;
  yChannel: GlassSurfaceChannel;
}

interface ShapeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShapeTrace {
  box: ShapeBox;
  depth: Float32Array;
  w: number;
  h: number;
  ratio: number;
  line: string;
  glow: string;
}

interface CachedTrace extends ShapeTrace {
  image: HTMLImageElement;
  width: number;
  height: number;
}

type ShapeArt =
  | { src: string; box: ShapeBox; line: string; glow: string; failed?: false }
  | { src: string; failed: true };

export interface GlassSurfaceProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: GlassSurfaceChannel;
  yChannel?: GlassSurfaceChannel;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  refraction?: boolean;
  renderer?: GlassSurfaceRenderer;
  backdrop?: RefObject<GlassSurfaceBackdrop | null> | GlassSurfaceBackdrop | null;
  shape?: string;
  className?: string;
  style?: CSSProperties;
}

const FAR = 1e20;

const GLASS_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const GLASS_FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uBackdrop;
uniform sampler2D uMap;
uniform vec2 uCanvas;
uniform vec2 uSize;
uniform vec2 uOrigin;
uniform vec2 uStep;
uniform vec3 uScale;
uniform ivec2 uChannel;
uniform float uSpread;
uniform float uLod;
uniform float uSaturation;
out vec4 outColor;

vec4 bend(vec2 p) {
  vec4 map = texture(uMap, clamp(p / uSize, 0.0, 1.0));
  vec2 shift = vec2(map[uChannel.x], map[uChannel.y]) - 0.5;
  vec2 base = uOrigin + p * uStep;
  vec4 red = textureLod(uBackdrop, base + shift * uScale.r * uStep, uLod);
  vec4 green = textureLod(uBackdrop, base + shift * uScale.g * uStep, uLod);
  vec4 blue = textureLod(uBackdrop, base + shift * uScale.b * uStep, uLod);
  return vec4(red.r, green.g, blue.b, (red.a + green.a + blue.a) / 3.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y) / uCanvas * uSize;
  vec4 color = vec4(0.0);
  if (uSpread < 0.05) {
    color = bend(p);
  } else {
    float total = 0.0;
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 offset = vec2(float(i), float(j)) * uSpread * 0.8;
        float weight = exp(-dot(offset, offset) / (2.0 * uSpread * uSpread));
        color += bend(p + offset) * weight;
        total += weight;
      }
    }
    color /= total;
  }
  vec3 rgb = color.a > 0.0 ? color.rgb / color.a : vec3(0.0);
  float s = uSaturation;
  mat3 tone = mat3(
    0.213 + 0.787 * s, 0.213 - 0.213 * s, 0.213 - 0.213 * s,
    0.715 - 0.715 * s, 0.715 + 0.285 * s, 0.715 - 0.715 * s,
    0.072 - 0.072 * s, 0.072 - 0.072 * s, 0.072 + 0.928 * s
  );
  rgb = clamp(tone * rgb, 0.0, 1.0);
  outColor = vec4(rgb * color.a, color.a);
}`;

const CHANNELS: Record<string, number> = { R: 0, G: 1, B: 2, A: 3 };

const compileGlass = (gl: WebGL2RenderingContext) => {
  const make = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };
  const vertex = make(gl.VERTEX_SHADER, GLASS_VERTEX);
  const fragment = make(gl.FRAGMENT_SHADER, GLASS_FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const resolveBackdrop = (backdrop: GlassSurfaceProps['backdrop']): GlassSurfaceBackdrop | null => {
  if (typeof window === 'undefined' || !backdrop) return null;
  const node = typeof backdrop === 'object' && 'current' in backdrop ? backdrop.current : backdrop;
  if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) {
    return node;
  }
  return null;
};

const sourceSize = (node: GlassSurfaceBackdrop): [number, number] => {
  if (node instanceof HTMLImageElement) return [node.naturalWidth, node.naturalHeight];
  if (node instanceof HTMLVideoElement) return [node.videoWidth, node.videoHeight];
  return [node.width, node.height];
};

const placeAxis = (value: string | undefined, free: number) => {
  if (!value) return free / 2;
  if (value.endsWith('%')) return (parseFloat(value) / 100) * free;
  const px = parseFloat(value);
  return Number.isFinite(px) ? px : free / 2;
};

const contentBox = (node: GlassSurfaceBackdrop) => {
  const rect = node.getBoundingClientRect();
  const [naturalWidth, naturalHeight] = sourceSize(node);
  const style = getComputedStyle(node);
  const fit = style.objectFit || 'fill';
  if (!naturalWidth || !naturalHeight || fit === 'fill') {
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
  }
  const contain = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
  const cover = Math.max(rect.width / naturalWidth, rect.height / naturalHeight);
  const scale = fit === 'cover' ? cover : fit === 'contain' ? contain : fit === 'none' ? 1 : Math.min(1, contain);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const [px, py] = (style.objectPosition || '50% 50%').split(' ');
  return {
    x: rect.left + placeAxis(px, rect.width - width),
    y: rect.top + placeAxis(py ?? px, rect.height - height),
    width,
    height
  };
};

const distanceLine = (f: Float64Array, d: Float64Array, v: Int32Array, z: Float64Array, n: number) => {
  let k = 0;
  v[0] = 0;
  z[0] = -FAR;
  z[1] = FAR;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = FAR;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
};

const distanceGrid = (grid: Float32Array, w: number, h: number) => {
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    distanceLine(f, d, v, z, h);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    distanceLine(f, d, v, z, w);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
};

const blurLine = (src: Float32Array, dst: Float32Array, offset: number, stride: number, n: number, r: number) => {
  const scale = 1 / (2 * r + 1);
  let sum = src[offset] * (r + 1);
  for (let i = 1; i <= r; i++) sum += src[offset + Math.min(i, n - 1) * stride];
  for (let i = 0; i < n; i++) {
    dst[offset + i * stride] = sum * scale;
    sum += src[offset + Math.min(i + r + 1, n - 1) * stride] - src[offset + Math.max(i - r, 0) * stride];
  }
};

const blurGrid = (grid: Float32Array, w: number, h: number, r: number) => {
  const tmp = new Float32Array(w * h);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) blurLine(grid, tmp, y * w, 1, w, r);
    for (let x = 0; x < w; x++) blurLine(tmp, grid, x, w, h, r);
  }
};

const settle = (x: number) => 1 / (1 + Math.exp(-1.702 * x));

const paint = (w: number, h: number, fill: (data: Uint8ClampedArray) => void) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const image = context.createImageData(w, h);
  fill(image.data);
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
};

const traceShape = (image: HTMLImageElement, width: number, height: number, ratio: number): ShapeTrace => {
  const naturalWidth = image.naturalWidth || width;
  const naturalHeight = image.naturalHeight || height;
  const fit = Math.min(width / naturalWidth, height / naturalHeight);
  const box = {
    x: (width - naturalWidth * fit) / 2,
    y: (height - naturalHeight * fit) / 2,
    width: naturalWidth * fit,
    height: naturalHeight * fit
  };
  const w = Math.max(2, Math.round(width * ratio));
  const h = Math.max(2, Math.round(height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  context.drawImage(image, box.x * ratio, box.y * ratio, box.width * ratio, box.height * ratio);
  const pixels = context.getImageData(0, 0, w, h).data;
  const outside = new Float32Array(w * h);
  const inside = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const edge = 0.5 - pixels[i * 4 + 3] / 255;
    outside[i] = edge >= 0.5 ? FAR : Math.max(edge, 0) ** 2;
    inside[i] = edge <= -0.5 ? FAR : Math.min(edge, 0) ** 2;
  }
  distanceGrid(outside, w, h);
  distanceGrid(inside, w, h);
  const depth = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) depth[i] = (Math.sqrt(inside[i]) - Math.sqrt(outside[i])) / ratio;
  return {
    box,
    depth,
    w,
    h,
    ratio,
    line: paint(w, h, data => { data.fill(255); for (let i = 0; i < w * h; i++) data[i * 4 + 3] = 255 * (1 - settle(depth[i] - 1)); }),
    glow: paint(w, h, data => { data.fill(255); for (let i = 0; i < w * h; i++) data[i * 4 + 3] = 255 * (1 - settle((depth[i] - 4) / 5)); })
  };
};

const WEBGL_SHADOW = ['0px 4px 16px rgba(17, 17, 26, 0.05)', '0px 8px 24px rgba(17, 17, 26, 0.05)', '0px 16px 56px rgba(17, 17, 26, 0.05)'].join(', ');
const FRAME_SHADOW = ['0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%)) inset'].join(', ');
const LINE = { svg: 'light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%))', fallback: 'light-dark(color-mix(in oklch, black, transparent 88%), color-mix(in oklch, white, transparent 72%))' };
const GLOW = { svg: 'light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%))', fallback: 'light-dark(color-mix(in oklch, white, transparent 72%), color-mix(in oklch, white, transparent 90%))' };
const SVG_SHADOW = ['0px 4px 16px rgba(17, 17, 26, 0.05)'].join(', ');
const FALLBACK_SHADOW = ['0px 4px 16px rgba(17, 17, 26, 0.06)'].join(', ');
const SHEEN = 'linear-gradient(135deg, light-dark(hsl(0 0% 100% / 0.42), hsl(0 0% 100% / 0.14)) 0%, transparent 100%)';
const RIM = 'linear-gradient(150deg, light-dark(hsl(0 0% 100% / 0.7), hsl(0 0% 100% / 0.34)), transparent)';
const RING = 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)';

export const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  refraction = true,
  renderer = 'auto',
  backdrop,
  shape,
  className = '',
  style = {}
}: GlassSurfaceProps) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;
  const softId = `soft-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState<boolean>(false);
  const [blurSupported, setBlurSupported] = useState<boolean>(true);
  const [checked, setChecked] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [boxSize, setBoxSize] = useState<string>('');
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement | null }>({ src: '', image: null });
  const [art, setArt] = useState<ShapeArt | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const traceRef = useRef<CachedTrace | null>(null);
  const shapeMapRef = useRef<string>('');
  const mapUrlRef = useRef('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<GlassSettings | null>(null);

  settingsRef.current = { backdrop, displace, saturation, distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel };

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient>
          <filter id="${softId}" filterUnits="userSpaceOnUse" x="0" y="0" width="${actualWidth}" height="${actualHeight}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${blur}" /></filter>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" filter="url(#${softId})" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    mapUrlRef.current = shapeMapRef.current || generateDisplacementMap();
    feImageRef.current?.setAttribute('href', mapUrlRef.current);
  };

  useEffect(() => {
    updateDisplacementMap();
    [{ ref: redChannelRef, offset: redOffset }, { ref: greenChannelRef, offset: greenOffset }, { ref: blueChannelRef, offset: blueOffset }].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString());
        ref.current.setAttribute('xChannelSelector', xChannel);
        ref.current.setAttribute('yChannelSelector', yChannel);
      }
    });
    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
  }, [boxSize, width, height, borderRadius, borderWidth, brightness, opacity, blur, displace, distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, mixBlendMode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      const el = containerRef.current;
      if (el) setBoxSize(`${el.offsetWidth}x${el.offsetHeight}`);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSvgSupported(false); // Fallback to safe SVG/Frosted rendering
    setBlurSupported(CSS.supports('backdrop-filter', 'blur(1px)'));
    setChecked(true);
  }, []);

  const webgl = checked && refraction && Boolean(backdrop) && !webglFailed && (renderer === 'webgl' || (renderer === 'auto' && !svgSupported));
  const refractive = !webgl && svgSupported && refraction;
  const frosted = !webgl && !refractive;

  const outline = shape && art?.src === shape && !art.failed ? art : null;
  const containerStyle = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    background: frosted ? `hsl(0 0% 100% / ${0.12 + backgroundOpacity * 0.5})` : undefined,
    backdropFilter: `blur(12px) saturate(${saturation * 1.4})`,
    WebkitBackdropFilter: `blur(12px) saturate(${saturation * 1.4})`,
    boxShadow: FALLBACK_SHADOW
  } as CSSProperties;

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center overflow-hidden ${className}`} style={containerStyle}>
      <div className="relative z-[1] flex h-full w-full items-center justify-center rounded-[inherit] p-3">
        {children}
      </div>
    </div>
  );
};


// ==========================================
// 2. CARD SWAP COMPONENT WITH GLASS EMBEDDED
// ==========================================
export interface CardSwapItem {
  title?: string;
  image?: string;
  video?: string;
  icon?: ReactNode;
  alt?: string;
  description?: string;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

export interface CardSwapProps {
  items?: CardSwapItem[];
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  depth?: number;
  skewAmount?: number;
  visibleCards?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  speed?: number;
  bounce?: number;
  parallax?: number;
  hoverSpread?: number;
  dim?: number;
  cardRadius?: number;
  intro?: boolean;
  theme?: 'dark' | 'light';
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  children?: ReactNode;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

type Axis = 'x' | 'y' | 'z' | 'r' | 'p';
type Vec = { x: number; y: number };
type Pose = Record<Axis, number>;

const PERSPECTIVE = 900;
const TAU = Math.PI * 2;
const STEP = 1 / 240;
const PAD = 32;
const AXES: Axis[] = ['x', 'y', 'z', 'r', 'p'];
const DOWN: Vec = { x: 0, y: 1 };

const SIZER_STYLE: CSSProperties = { maxWidth: 'var(--swap-stage-w)', aspectRatio: 'var(--swap-ratio)' };
const STAGE_STYLE: CSSProperties = { width: 'var(--swap-stage-w)', height: 'var(--swap-stage-h)', perspective: '900px', transform: 'translate(-50%, -50%)' };
const SLOT_STYLE: CSSProperties = { top: 'var(--swap-oy)', left: 'var(--swap-ox)', width: 'var(--swap-w)', height: 'var(--swap-h)', margin: 'calc(var(--swap-h) / -2) 0 0 calc(var(--swap-w) / -2)', borderRadius: 'var(--swap-radius)', boxShadow: 'var(--swap-shadow)', backfaceVisibility: 'hidden' };
const SLOT_CLASS = 'pointer-events-auto absolute isolate touch-pan-y overflow-hidden select-none';

const THEMES: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--swap-tile': '#0e0e0e',
    '--swap-tile-edge': 'rgba(255, 255, 255, 0.08)',
    '--swap-tile-highlight': 'rgba(255, 255, 255, 0.15)',
    '--swap-shadow': '0 30px 60px -24px rgba(0, 0, 0, 0.8)',
    '--swap-media-edge': 'rgba(255, 255, 255, 0.06)',
    '--swap-ink': '#f4f4f5',
    '--swap-badge': 'rgba(255, 255, 255, 0.08)',
    '--swap-shade': '#100e15'
  },
  light: {
    '--swap-tile': '#ffffff',
    '--swap-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--swap-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--swap-shadow': '0 30px 60px -28px rgba(24, 24, 27, 0.35)',
    '--swap-media-edge': 'rgba(24, 24, 27, 0.06)',
    '--swap-ink': '#27272a',
    '--swap-badge': 'rgba(24, 24, 27, 0.05)',
    '--swap-shade': '#ffffff'
  }
};

const DEFAULT_ITEMS: CardSwapItem[] = [
  {
    title: 'Converter Media',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop',
    description: 'Simply convert media files to your desired format with ease and speed.',
    icon: <HugeiconsIcon icon={SunsetIcon} size={14} strokeWidth={1.8} />
  },
  {
    title: 'eCommerce Solution',
    image: 'https://images.unsplash.com/photo-1557821552-1710517667cc?w=900&q=80&auto=format&fit=crop',
    description: 'Boost your online sales with our powerful eCommerce solutions.',
    icon: <HugeiconsIcon icon={BeachIcon} size={14} strokeWidth={1.8} />
  }
];

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, children, style, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={['relative isolate box-border h-full w-full overflow-hidden rounded-[inherit]', customClass, className].filter(Boolean).join(' ')}
      style={{ background: 'var(--swap-tile)', color: 'var(--swap-ink)', ...style }}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

const ItemCard = ({ item }: { item: CardSwapItem }) => {
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

  return (
    <Card>
      <div className="relative h-full w-full overflow-hidden bg-neutral-950">
        {item.video ? (
          <video
            ref={mediaRef as RefObject<HTMLVideoElement>}
            src={item.video}
            className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : item.image ? (
          <img
            ref={mediaRef as RefObject<HTMLImageElement>}
            src={item.image}
            alt={item.alt ?? item.title ?? ''}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          />
        ) : null}

        {/* Liquid Glass Overlay Box */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end pointer-events-auto">
          <GlassSurface
            backdrop={mediaRef}
            distortionScale={-70}
            displace={2.5}
            brightness={41}
            backgroundOpacity={0.12}
            redOffset={10}
            greenOffset={10}
            blueOffset={20}
            borderRadius={16}
            className="p-4 border border-white/15 shadow-2xl"
          >
            <div className="flex flex-col w-full text-left">
              <div className="flex items-center gap-2">
                {item.icon && (
                  <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-white/10 text-white">
                    {item.icon}
                  </span>
                )}
                {item.title && (
                  <h3 className="text-lg font-bold text-white tracking-wide">{item.title}</h3>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-zinc-300 mt-1 line-clamp-1">{item.description}</p>
              )}
            </div>
          </GlassSurface>
        </div>
      </div>
    </Card>
  );
};

export const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
      items,
      width = 680,
      height = 420,
      cardDistance = 80,
      verticalDistance = 90,
      depth = 110,
      skewAmount = 6,
      visibleCards = 4,
      delay = 4000,
      autoplay = true,
      pauseOnHover = true,
      draggable = true,
      speed = 1,
      bounce = 0.35,
      parallax = 0.5,
      hoverSpread = 0.12,
      dim = 0.5,
      cardRadius = 20,
      intro = true,
      theme = 'dark',
      onCardClick,
      onChange,
      className = '',
      children
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const apiRef = useRef<any>(null);
    const settingsRef = useRef<any>(null);

    const cards = useMemo(() => {
      const custom = Children.toArray(children).filter(isValidElement);
      if (custom.length) return custom;
      return (items?.length ? items : DEFAULT_ITEMS).map((item, index) => (
        <ItemCard key={`card-${index}`} item={item} />
      ));
    }, [children, items]);

    const count = cards.length;
    const cardWidth = Math.max(40, Number(width) || 680);
    const cardHeight = Math.max(40, Number(height) || 420);
    const visible = clamp(Math.round(visibleCards), 1, Math.max(1, count));

    const bounds = useMemo(() => {
      const slope = Math.tan((skewAmount * Math.PI) / 180);
      const spread = 1 + Math.max(0, hoverSpread);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < visible; i++) {
        const scale = PERSPECTIVE / (PERSPECTIVE + i * depth);
        for (const u of [-cardWidth / 2, cardWidth / 2]) {
          for (const v of [-cardHeight / 2, cardHeight / 2]) {
            const x = (i * cardDistance * spread + u) * scale;
            const y = (-i * verticalDistance * spread + v + u * slope) * scale;
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
          }
        }
      }
      return { width: Math.ceil(maxX - minX + PAD * 2), height: Math.ceil(maxY - minY + PAD * 2), originX: PAD - minX, originY: PAD - minY };
    }, [cardWidth, cardHeight, cardDistance, verticalDistance, depth, skewAmount, visible, hoverSpread]);

    settingsRef.current = { width: cardWidth, height: cardHeight, dx: cardDistance, dy: verticalDistance, dz: Math.max(0, depth), skew: skewAmount, visible, delay, autoplay, pauseOnHover, draggable, speed: clamp(speed, 0.1, 4), bounce: clamp(bounce, 0, 1), parallax: clamp(parallax, 0, 1), hoverSpread: Math.max(0, hoverSpread), dim: clamp(dim, 0, 1), bounds, onCardClick, onChange };

    useImperativeHandle(ref, () => ({ next: () => apiRef.current?.next(), prev: () => apiRef.current?.prev() }), []);

    useLayoutEffect(() => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage || !count) return;

      const deck = Array.from({ length: count }, (_, index) => ({
        el: slotRefs.current[index],
        shade: shadeRefs.current[index],
        index, pos: index, from: index, hold: 0, nudge: 0, phase: 'rest' as const, dir: DOWN, tilt: 0, top: 0, under: false, x: 0, y: 0, z: 0, r: 0, p: 0, v: { x: 0, y: 0, z: 0, r: 0, p: 0 }
      }));

      const state = { order: deck.map(c => c.index), raf: 0, last: 0, timer: 0, queue: [] as number[], layers: 0, scale: 1, hovered: false, overCard: false, inView: true, drag: null as any, spread: 0, spreadV: 0, px: 0, py: 0, pvx: 0, pvy: 0, tx: 0, ty: 0, dragged: false };

      const slot = (position: number, s: any) => {
        const q = Math.min(position, s.visible);
        const spread = 1 + state.spread;
        return { x: q * s.dx * spread, y: -q * s.dy * spread, z: -q * s.dz, r: 0, p: q };
      };

      const write = (card: any, s: any) => {
        const { el, shade } = card;
        if (!el) return;
        el.style.transform = `translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, ${card.z.toFixed(2)}px) rotate(${card.r.toFixed(3)}deg) skewY(${s.skew}deg)`;
        el.style.zIndex = String(card.top ? 1000 + card.top : card.under ? 1 : 10 + (count - card.pos) * 2);
        const fade = clamp(s.visible - card.p, 0, 1);
        el.style.opacity = fade < 1 ? fade.toFixed(3) : '';
        if (shade) shade.style.opacity = (s.dim * 0.62 * clamp(card.p / Math.max(1, s.visible - 1), 0, 1)).toFixed(3);
      };

      const frame = (time: number) => {
        state.raf = 0;
        const s = settingsRef.current;
        const dt = state.last ? Math.min(0.05, (time - state.last) / 1000) : 1 / 60;
        state.last = time;
        let busy = false;

        for (const card of deck) {
          const target = slot(Math.max(0, card.pos + card.nudge), s);
          for (const ax of AXES) {
            card[ax] += (target[ax] - card[ax]) * 0.15;
            if (Math.abs(target[ax] - card[ax]) > 0.05) busy = true;
          }
          write(card, s);
        }

        if (busy) state.raf = requestAnimationFrame(frame);
      };

      const wake = () => { if (!state.raf) state.raf = requestAnimationFrame(frame); };

      apiRef.current = {
        next: () => {
          const front = deck[state.order[0]];
          state.order = [...state.order.slice(1), front.index];
          deck.forEach((c, i) => { c.pos = state.order.indexOf(c.index); });
          wake();
        },
        prev: () => {
          const back = deck[state.order[count - 1]];
          state.order = [back.index, ...state.order.slice(0, count - 1)];
          deck.forEach((c, i) => { c.pos = state.order.indexOf(c.index); });
          wake();
        }
      };

      deck.forEach(card => Object.assign(card, slot(card.pos, settingsRef.current)));
      wake();

      return () => cancelAnimationFrame(state.raf);
    }, [count]);

    const rootStyle = {
      ...(THEMES[theme] ?? THEMES.dark),
      '--swap-w': `${cardWidth}px`,
      '--swap-h': `${cardHeight}px`,
      '--swap-ox': `${bounds.originX}px`,
      '--swap-oy': `${bounds.originY}px`,
      '--swap-stage-w': `${bounds.width}px`,
      '--swap-stage-h': `${bounds.height}px`,
      '--swap-ratio': `${bounds.width} / ${bounds.height}`,
      '--swap-radius': `${Math.max(0, cardRadius)}px`
    } as CSSProperties;

    return (
      <div
        ref={rootRef}
        className={`group/swap relative h-full w-full outline-none [-webkit-tap-highlight-color:transparent] ${className}`.trim()}
        style={rootStyle}
        tabIndex={0}
        role="region"
        aria-label="Card stack"
      >
        <div className="pointer-events-none max-h-full overflow-hidden" aria-hidden="true">
          <span className="block w-full" style={SIZER_STYLE} />
        </div>
        <div ref={stageRef} className="pointer-events-none absolute top-1/2 left-1/2" style={STAGE_STYLE}>
          {cards.map((card, index) => (
            <div
              key={index}
              ref={node => { slotRefs.current[index] = node; }}
              className={SLOT_CLASS}
              style={SLOT_STYLE}
              data-swap-index={index}
            >
              {card}
              <span
                ref={node => { shadeRefs.current[index] = node; }}
                className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] opacity-0"
                style={{ background: 'var(--swap-shade)' }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CardSwap.displayName = 'CardSwap';

export default CardSwap;