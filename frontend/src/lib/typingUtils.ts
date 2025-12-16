export const calculateWPM = (correctChars: number, timeInMinutes: number): number => {
  if (timeInMinutes === 0) return 0;
  return (correctChars / 5) / timeInMinutes;
};

export const calculateAccuracy = (totalChars: number, errors: number): number => {
  if (totalChars === 0) return 100;
  return Math.max(0, ((totalChars - errors) / totalChars) * 100);
};

export const calculateConsistency = (keyPresses: Record<string, any>): number => {
  const times = Object.values(keyPresses).flatMap((key: any) => key.times || []);
  if (times.length < 2) return 100;
  
  const intervals = [];
  for (let i = 1; i < times.length; i++) {
    intervals.push((times[i] as number) - (times[i - 1] as number));
  }
  
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  
  return Math.max(0, 100 - stdDev);
};
