import generateRouterFile from './router';
import generateCoreFiles from './core';
import generatePackageJsonFile from './packageJson';

const generateServer = async (
  componentPackages: string[],
  source: string,
  dev: boolean,
): Promise<[void[], void, void]> => {
  return Promise.all([
    generateCoreFiles(),
    generateRouterFile(componentPackages),
    generatePackageJsonFile(source, dev),
  ]);
};

export default generateServer;
