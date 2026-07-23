'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, User } from 'lucide-react';

/**
 * SafeImage — A wrapper around next/image with automatic fallbacks
 * 
 * Props:
 * - src: Primary image source
 * - fallbackSrc: Optional secondary image source
 * - alt: Alt text (required)
 * - type: 'logo' | 'avatar' | 'developer' | 'generic'
 * - width / height: Image dimensions
 * - className: Additional CSS classes
 */
export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  type = 'generic',
  width = 32,
  height = 32,
  className = '',
  priority = false,
  ...props
}) {
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // Determine the image source to use
  const imageSrc = imgError && fallbackSrc ? fallbackSrc : src;
  const hasError = imgError && (!fallbackSrc || fallbackError);

  // Render fallback UI if all image sources fail
  if (hasError) {
    return renderFallback(type, width, height, className);
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      onError={() => {
        if (!imgError) {
          setImgError(true);
        } else {
          setFallbackError(true);
        }
      }}
      {...props}
    />
  );
}

function renderFallback(type, width, height, className) {
  const size = Math.max(width, height);

  switch (type) {
    case 'logo':
      return (
        <div
          className={`bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center animate-glow ${className}`}
          style={{ width, height }}
        >
          <Sparkles className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
        </div>
      );

    case 'avatar':
    case 'developer':
      return (
        <div
          className={`bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 rounded-full flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <User className="text-white" style={{ width: size * 0.4, height: size * 0.4 }} />
        </div>
      );

    default:
      return (
        <div
          className={`bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <Sparkles className="text-gray-600" style={{ width: size * 0.4, height: size * 0.4 }} />
        </div>
      );
  }
}

// ============================================================
// PRE-BUILT SPECIFIC COMPONENTS
// ============================================================

/**
 * LogoImage — For website logo with automatic fallback
 */
export function LogoImage({ width = 40, height = 40, variant = 'default', className = '' }) {
  const logoSrc = variant === 'light'
    ? '/assets/logo/logo-light.png'
    : variant === 'dark'
    ? '/assets/logo/logo-dark.png'
    : '/assets/logo/logo.png';

  return (
    <SafeImage
      src={logoSrc}
      fallbackSrc="/icon.png"
      alt="AIVision Logo"
      type="logo"
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
    />
  );
}

/**
 * DeveloperImage — For developer profile picture with fallback
 */
export function DeveloperImage({ width = 128, height = 128, className = '' }) {
  return (
    <SafeImage
      src="/assets/developer/zaniyar.jpg"
      fallbackSrc="/icon.png"
      alt="Zaniyar Al-Mzurii - Developer"
      type="developer"
      width={width}
      height={height}
      className={`rounded-full object-cover ${className}`}
    />
  );
}

/**
 * FaviconImage — Small icon version
 */
export function FaviconImage({ width = 32, height = 32, className = '' }) {
  return (
    <SafeImage
      src="/favicon.ico"
      fallbackSrc="/icon.png"
      alt="AIVision"
      type="logo"
      width={width}
      height={height}
      className={`rounded ${className}`}
    />
  );
}
