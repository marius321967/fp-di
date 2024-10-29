import { Notifier } from './my-types';
import { SmsService } from './sms-service';

export const emailNotifier: Notifier = (destination: string) =>
  Promise.resolve('email sent');

export const smsNotifier =
  (smsService: SmsService): Notifier =>
  (destination: string) =>
    smsService.sendPacket(JSON.stringify({ destination, message: 'Wake up!' }));
