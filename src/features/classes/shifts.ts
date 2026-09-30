import { Clock, Moon, Sun, Sunset, type LucideIcon } from 'lucide-react-native';

import { SHIFTS, type Shift } from './types';

interface ShiftMeta {
  label: string;
  icon: LucideIcon;
  tone: string;
}

export const SHIFT_META: Record<Shift, ShiftMeta> = {
  morning: {
    label: 'Manhã',
    icon: Sun,
    tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  afternoon: {
    label: 'Tarde',
    icon: Sunset,
    tone: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  },
  evening: {
    label: 'Noite',
    icon: Moon,
    tone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  },
  full: {
    label: 'Integral',
    icon: Clock,
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
};

export { SHIFTS };
