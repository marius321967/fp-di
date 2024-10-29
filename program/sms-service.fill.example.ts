import { smsHostAddress } from './sms-config';
import {
  buildFakeSmsService,
  buildRealSmsService,
  SmsService,
} from './sms-service';

export const fill_buildRealSmsService: SmsService =
  buildRealSmsService(smsHostAddress);
export const fill_buildFakeSmsService: SmsService = buildFakeSmsService();
