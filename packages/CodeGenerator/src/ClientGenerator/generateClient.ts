import generatePackageFile from './package';
import generateComponentsFile from './components';
import { copyCode } from './copyCode';

interface Args {
  componentPackages: string[];
  source: string;
  dev: boolean;
}

const generateClient = async ({ componentPackages, source, dev }: Args): Promise<[void, void]> => {
  copyCode();
  return Promise.all([generatePackageFile(source, dev), generateComponentsFile(componentPackages)]);
};

export default generateClient;
