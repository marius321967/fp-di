import { EmailServiceAddress, SmsServiceAddress } from './types';

export const apiServiceAddress: EmailServiceAddress & SmsServiceAddress =
  'http://my-service:3000';
