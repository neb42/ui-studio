import { copySync } from 'fs-extra';
import * as path from 'path';

import { FilePaths } from '../FilePaths';

export const copyCode = () => {
  return copySync(path.join(__dirname, 'code'), FilePaths.client);
};