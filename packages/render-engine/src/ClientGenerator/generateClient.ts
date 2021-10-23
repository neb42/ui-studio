import generatePackageFile from './package';
import generateComponentsFile from './components';
import { copyCode } from './copyCode';
import generateComponentTypesFile from './componentTypes';
import generateEntryPoint from './entryPoint';
import { UIStudioConfig } from './parseConfig';

interface Args {
  config: UIStudioConfig;
  source: string;
}

const generateClient = async ({ config, source }: Args): Promise<[void, void, void, void]> => {
  copyCode();
  return Promise.all([
    generateEntryPoint(config),
    generateComponentTypesFile(config),
    generatePackageFile(config, source),
    generateComponentsFile(config),
  ]);
};

export default generateClient;
