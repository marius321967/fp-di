import { Notifier, User } from './my-types';

export const notifyUser = (notifier: Notifier) => (user: User) =>
  notifier(user.contact);
