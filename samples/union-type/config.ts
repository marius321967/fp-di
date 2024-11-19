import { EmailServiceAddress, SmsServiceAddress } from './types';

const apiServiceAddress: SmsServiceAddress = 'http://my-service:3000';

const foo: EmailServiceAddress = 'http://my-email-service:3000';
export default foo;
export { apiServiceAddress as serviceAddress };
