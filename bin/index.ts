import { getConfig } from '../cli/config.js';
import { transform } from '../cli/transform.js';

getConfig().then(transform);
