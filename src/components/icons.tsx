import type { FC } from 'react';
import { Circle, Line, Path, Rect, Svg } from 'react-native-svg';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaultProps = {
  size: 20,
  color: '#17181C',
  strokeWidth: 1.8,
};

export const MailIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 6l10 7 10-7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LockIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="10" rx="2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EyeIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const EyeOffIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const LinkIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const InfoIcon: FC<IconProps> = ({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="12" y1="8" x2="12" y2="12.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="16" r="0.9" fill={color} />
  </Svg>
);
