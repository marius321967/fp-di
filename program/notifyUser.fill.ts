import { smsNotifier } from './notifiers';
import { notifyUser as fill_NotifyUser } from './notifyUser';

export const notifyUser = fill_NotifyUser(smsNotifier);
