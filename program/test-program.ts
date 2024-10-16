import { MyEmail, MyName, MyPassword } from './my-types';
import './my-values';
import './notifiers';
import './notifyUser';
import './userDeleters';

// for function to be injected:
// - function type must be exported
// - builder must identify return type (which is type above)
// - builder must be exported

// for var to be injected:
// - type must be exported
// - declaration must be exported either as default or const
// - there must not be competing candidates

export default (pass: MyPassword, name: MyEmail | MyName) => {
  console.log('the program runs with values:', pass, name);
};
