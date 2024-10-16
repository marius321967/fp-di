import { Notifier, User, UserDeleter } from './my-types';

export const notifyUser = (notifier: Notifier) => (user: User) =>
  notifier(user.contact);

export const deleteUser = (userDeleter: UserDeleter) => (user: User) =>
  userDeleter(user.id);
