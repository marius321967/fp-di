import { getConfig } from './config';
import { transform } from './transform';

getConfig().then(transform);
