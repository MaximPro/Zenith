/**
 * Formats seconds into MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '00:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Formats seconds into hours (decimal)
 */
export const formatHours = (seconds: number): number => {
  return Math.floor((seconds / 3600) * 10) / 10;
};
