import { UserNotifier } from './my-types';
import { fill_smsNotifier } from './notifiers.fill.expected';
import { notifyUser } from './notifyUser';
export const fill_notifyUser: UserNotifier = notifyUser(fill_smsNotifier);
