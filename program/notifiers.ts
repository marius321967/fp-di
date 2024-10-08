import { Notifier } from './my-types';

export const emailNotifier: Notifier = (destination: string) =>
  Promise.resolve('email sent');

export const smsNotifier: Notifier = (destination: string) =>
  Promise.resolve('sms sent');
