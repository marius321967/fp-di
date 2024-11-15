import { EmailServiceAddress, SmsServiceAddress } from './types';

export default (
  emailHost: EmailServiceAddress,
  smsHost: SmsServiceAddress,
): void => {
  console.log(`Email host: ${emailHost}, SMS host: ${smsHost}`);
};
