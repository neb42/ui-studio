import * as path from 'path';

import { copySync } from 'fs-extra';

import { FilePaths } from '../FilePaths';

export const copyCode = () => {
  return copySync(path.join(__dirname, 'code'), FilePaths.client);
};
