import { UserNotifier } from './my-types';
import { fill_smsNotifier } from './notifiers.fill.example';
import { notifyUser } from './notifyUser';
export const fill_notifyUser: UserNotifier = notifyUser(fill_smsNotifier);
