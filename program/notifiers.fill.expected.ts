import { Notifier } from './my-types';
import { smsNotifier } from './notifiers';
import { fill_buildFakeSmsService } from './sms-service.fill.expected';
export const fill_smsNotifier: Notifier = smsNotifier(fill_buildFakeSmsService);
