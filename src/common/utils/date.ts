import dayjs from 'dayjs';

export function dateToDelay(dateExpression: Date): number {
  const expDate = dayjs(dateExpression);
  const delayInMs = expDate.diff(dayjs());
  return Math.max(delayInMs, 0);
}
