import { UserDeleter } from './my-types';

export const softUserDeleter: UserDeleter = (id: string) => {};
export const hardUserDeleter: UserDeleter = (id: string) => {};
