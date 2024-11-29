import React from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export const ICONS = {
  // Tabs
  school: 'school',
  person: 'person',
  settings: 'settings',
  
  // Common
  search: 'search',
  close: 'close-circle',
  back: 'chevron-back',
  forward: 'chevron-forward',
  
  // Schedule
  calendar: 'calendar',
  location: 'location',
  time: 'time',
  
  // Other
  info: 'information-circle',
  alert: 'alert-circle',
  
  // Social
  github: 'logo-github',
  telegram: 'telegram'
} as const;

export type IconName = keyof typeof ICONS; 