import generatePackageFile from './package';
import generateComponentsFile from './components';
import { copyCode } from './copyCode';
import generateComponentTypesFile from './componentTypes';

interface Args {
  componentPackages: { name: string; version: string }[];
  source: string;
  dev: boolean;
}

const generateClient = async ({
  componentPackages,
  source,
  dev,
}: Args): Promise<[void, void, void]> => {
  copyCode();
  return Promise.all([
    generateComponentTypesFile(componentPackages),
    generatePackageFile(componentPackages, source, dev),
    generateComponentsFile(componentPackages),
  ]);
};

export default generateClient;
