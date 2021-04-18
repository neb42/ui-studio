import * as fs from 'fs';
import * as path from 'path';

import { FilePaths } from '../FilePaths';

const generateAppFile = (): void => {
  if (fs.existsSync(path.join(FilePaths.app, 'App.tsx'))) {
    fs.copyFileSync(path.join(FilePaths.app, 'App.tsx'), path.join(FilePaths.clientSrc, 'App.tsx'));
  }
};

export default generateAppFile;
