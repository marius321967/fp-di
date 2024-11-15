import { MyEmail, MyName, MyPassword, UserNotifier } from './my-types';
import './my-values';
import './notifiers';
import './notifyUser';
import './sms-config';
import './userDeleters';

export default (
  pass: MyPassword,
  name: MyEmail | MyName,
  notifyUser: UserNotifier,
) => {
  console.log('the program runs with values:', pass, name);

  notifyUser({ contact: name, id: '#123', password: pass });
};
