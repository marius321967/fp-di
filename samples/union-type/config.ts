import { EmailServiceAddress, SmsServiceAddress } from './types';

const apiServiceAddress: EmailServiceAddress & SmsServiceAddress =
  'http://my-service:3000';

export { apiServiceAddress as serviceAddress };
