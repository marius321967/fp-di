import { getConfig } from './config.js';
import { transform } from './transform.js';

getConfig().then(transform);
