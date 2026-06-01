import type { Account } from '@/lib/signals/types';

export const accounts: Account[] = [
  { id: 'acme', name: 'Acme Corp', arr: 42000, plan: 'Growth', segment: 'Mid-market', owner: 'Maja Lindberg' },
  { id: 'nordicpay', name: 'NordicPay', arr: 84000, plan: 'Growth', segment: 'Mid-market', owner: 'Felix Andersson' },
  { id: 'orbit', name: 'Orbit Systems', arr: 120000, plan: 'Enterprise', segment: 'Enterprise', owner: 'Sara Nyström' },
  { id: 'helios', name: 'Helios Labs', arr: 18000, plan: 'Starter', segment: 'SMB', owner: 'Per Bergström' },
  { id: 'kovacs', name: 'Kovacs & Co', arr: 7500, plan: 'Starter', segment: 'SMB', owner: 'Per Bergström' },
  { id: 'lumen', name: 'Lumen Health', arr: 96000, plan: 'Enterprise', segment: 'Enterprise', owner: 'Sara Nyström' },
  { id: 'tundra', name: 'Tundra Freight', arr: 31000, plan: 'Growth', segment: 'Mid-market', owner: 'Maja Lindberg' },
  { id: 'pelago', name: 'Pelago Studio', arr: 11000, plan: 'Starter', segment: 'SMB', owner: 'Felix Andersson' },
  { id: 'voltari', name: 'Voltari Energy', arr: 210000, plan: 'Enterprise', segment: 'Enterprise', owner: 'Sara Nyström' },
  { id: 'mossrose', name: 'Mossrose Retail', arr: 26000, plan: 'Growth', segment: 'Mid-market', owner: 'Felix Andersson' },
];
