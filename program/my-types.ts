export type MyPassword = string;
export type MyName = string;
export type MyEmail = string;
export type User = {
  password: MyPassword;
  contact: MyEmail | MyName;
};

export type Notifier = (destination: string) => Promise<unknown>;
