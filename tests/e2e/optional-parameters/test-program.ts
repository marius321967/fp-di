import './config.js';
import { EmailServiceAddress, SmsServiceAddress } from './types.js';

export default (
  emailHost: EmailServiceAddress,
  smsHost?: SmsServiceAddress,
): void => {
  console.log(`Email host: ${emailHost}, SMS host: ${smsHost}`);
};
