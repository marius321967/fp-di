// type User = { name: string; contact: string };

// export type Notifier = (destination: string) => Promise<unknown>;

// const unknownNotifier = (destination: string) => Promise.resolve();
// const emailNotifier: Notifier = (destination: string) =>
//   Promise.resolve('email sent');
// const smsNotifier: Notifier = (destination: string) =>
//   Promise.resolve('sms sent');

// export const notifyUser = (notifier: Notifier) => (user: User) =>
//   notifier(user.contact);

// for function to be injected:
// - function type must be exported
// - builder must identify return type (which is type above)
// - builder must be exported
// - there must not be competing candidates

// for var to be injected:
// - type must be exported
// - declaration must be exported either as default or const
// - there must not be competing candidates

// 1. find exported types
// 2. find values being exported for those types

export type MyPassword = string;
export type MyName = string;

export const mypass1: MyPassword = 'foo!',
  myName1: MyName = 'marius',
  myName2: MyName = 'darius';

export default (pass: MyPassword) => {
  console.log('the program runs!', pass);
};
