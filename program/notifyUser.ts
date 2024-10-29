import { Notifier, User, UserDeleter, UserNotifier } from './my-types';

export const notifyUser =
  (notifier: Notifier): UserNotifier =>
  (user: User) =>
    notifier(user.contact);

export const unnotifyUser = (notifier: Notifier) => (user: User) =>
  Promise.resolve();

export const deleteUser = (userDeleter: UserDeleter) => (user: User) =>
  userDeleter(user.id);
