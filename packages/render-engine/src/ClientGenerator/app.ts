import * as path from 'path';

import fs from 'fs-extra';

import { FilePaths } from '../FilePaths';

const generateAppFile = (): void => {
  fs.copySync(path.join(FilePaths.app, 'App'), path.join(FilePaths.clientSrc, 'App'));
};

export default generateAppFile;
