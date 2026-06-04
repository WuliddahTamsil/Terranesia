import React from 'react';

export type LogoVariant = 'main' | 'alternative-green' | 'alternative-white';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showTypeface?: boolean;
  className?: string;
}

// Size mapping in pixels
const sizeMap: Record<LogoSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const logoPathMap: Record<LogoVariant, Record<'full' | 'mark' | 'typeface', string>> = {
  'main': {
    full: '/logo/terranesia_main_logo.png',
    mark: '/logo/terranesia_main_logomark.png',
    typeface: '/logo/terranesia_main_typeface.png',
  },
  'alternative-green': {
    full: '/logo/terranesia_alternative_logo.png',
    mark: '/logo/terranesia_alternative_logomark.png',
    typeface: '/logo/terranesia_main_typeface.png', // same as main
  },
  'alternative-white': {
    full: '/logo/terranesia_alternative_white_logo.png',
    mark: '/logo/terranesia_alternative_white_logomark.png',
    typeface: '/logo/terranesia_alternative_white_typeface.png',
  },
};

/**
 * Logo component with multiple variants and sizes
 * 
 * @example
 * // Navbar logo - full with typeface
 * <Logo variant="main" size="sm" type="full" />
 * 
 * // Mark only
 * <Logo variant="main" size="lg" type="mark" />
 * 
 * // Typeface only
 * <Logo variant="main" size="md" type="typeface" />
 */
export function Logo({ 
  variant = 'main', 
  size = 'md', 
  showTypeface = true, 
  className = '' 
}: LogoProps) {
  const sizePixels = sizeMap[size];
  const paths = logoPathMap[variant];
  
  if (showTypeface) {
    return (
      <img
        src={paths.full}
        alt="Terranesia Logo"
        style={{ height: sizePixels * 0.6 }} // Adjust height for full logo
        className={`h-auto ${className}`}
      />
    );
  }

  return (
    <img
      src={paths.mark}
      alt="Terranesia Mark"
      width={sizePixels}
      height={sizePixels}
      className={`${className}`}
    />
  );
}

/**
 * Get typeface logo path
 */
export function getLogotypePath(variant: LogoVariant): string {
  return logoPathMap[variant].typeface;
}

/**
 * Logo Mark component (icon only)
 */
export function LogoMark({ 
  variant = 'main', 
  size = 'md', 
  className = '' 
}: Omit<LogoProps, 'showTypeface'>) {
  return <Logo variant={variant} size={size} showTypeface={false} className={className} />;
}

/**
 * Logo with Typeface component
 */
export function LogoWithTypeface({ 
  variant = 'main', 
  size = 'md', 
  className = '' 
}: Omit<LogoProps, 'showTypeface'>) {
  return <Logo variant={variant} size={size} showTypeface={true} className={className} />;
}
