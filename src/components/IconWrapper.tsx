import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { IconType, IconBaseProps } from 'react-icons';

// Define the type for the icon prop
interface IconProps {
  icon: IconType;
  size?: number;
  color?: string;
  className?: string;
}

// Generic Icon component with proper typing
export const Icon: React.FC<IconProps> = ({ icon: IconComponent, size, color, className }) => {
  const Component = IconComponent as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

// Direct export of each icon we need as a component that returns JSX.Element
export const WhatsappIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaWhatsapp as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const InstagramIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaInstagram as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const MapMarkerIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaMapMarkerAlt as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const CheckCircleIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaCheckCircle as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const StarIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaStar as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const UploadIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaUpload as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const CheckIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaCheck as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const ArrowLeftIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaArrowLeft as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const ShieldAltIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaShieldAlt as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const MoneyBillWaveIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaMoneyBillWave as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};

export const RegClockIcon = ({ size, color, className }: { size?: number; color?: string; className?: string }) => {
  const Component = FaIcons.FaRegClock as React.ComponentType<IconBaseProps>;
  return <Component size={size} color={color} className={className} />;
};
