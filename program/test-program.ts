import { MyEmail, MyName, MyPassword, UserNotifier } from './my-types';
import './my-values';
import './notifiers';
import './notifyUser';
import './sms-config';
import './userDeleters';

// for function to be injected:
// - function type must be exported
// - builder must identify return type (which is type above)
// - builder must be exported

// for var to be injected:
// - type must be exported
// - declaration must be exported either as default or const
// - there must not be competing candidates

export default (
  pass: MyPassword,
  name: MyEmail | MyName,
  notifyUser: UserNotifier,
) => {
  console.log('the program runs with values:', pass, name);

  notifyUser({ contact: name, id: '#123', password: pass });
};
