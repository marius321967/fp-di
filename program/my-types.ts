export type MyPassword = string;
export type MyName = string;
export type MyEmail = string;
export type User = {
  id: MyPassword;
  password: MyPassword;
  contact: MyEmail | MyName;
};

export type Notifier = (destination: string) => Promise<unknown>;
export type UserDeleter = (id: string) => void;
