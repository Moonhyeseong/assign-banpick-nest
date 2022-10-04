import { Turn } from './interfaces/turn.interface';

export const turnData: Turn[] = [
  { phase: 'ban', side: 'blue', role: 'TOP' },
  { phase: 'ban', side: 'red', role: 'TOP' },
  { phase: 'ban', side: 'blue', role: 'TOP' },
  { phase: 'ban', side: 'red', role: 'TOP' },
  { phase: 'ban', side: 'blue', role: 'TOP' },
  { phase: 'ban', side: 'red', role: 'TOP' },
  { phase: 'pick', side: 'blue', role: 'TOP' },
  { phase: 'pick', side: 'red', role: 'TOP' },
  { phase: 'pick', side: 'red', role: 'JUNGLE' },
  { phase: 'pick', side: 'blue', role: 'JUNGLE' },
  { phase: 'pick', side: 'blue', role: 'MID' },
  { phase: 'pick', side: 'red', role: 'MID' },
  { phase: 'ban', side: 'red', role: 'TOP' },
  { phase: 'ban', side: 'blue', role: 'TOP' },
  { phase: 'ban', side: 'red', role: 'TOP' },
  { phase: 'ban', side: 'blue', role: 'TOP' },
  { phase: 'pick', side: 'red', role: 'ADC' },
  { phase: 'pick', side: 'blue', role: 'ADC' },
  { phase: 'pick', side: 'blue', role: 'SUPPORT' },
  { phase: 'pick', side: 'red', role: 'SUPPORT' },
];

export const ROLEDATA = {
  solo: 0,
  TOP: 0,
  JUNGLE: 1,
  MID: 2,
  ADC: 3,
  SUPPORT: 4,
};
