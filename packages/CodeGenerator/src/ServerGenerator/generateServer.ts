import generateRouterFile from './router';
import generateCoreFiles from './core';
import generatePackageJsonFile from './packageJson';

const generateServer = async (source: string, dev: boolean) => {
  return Promise.all([
    generateCoreFiles(),
    generateRouterFile(),
    generatePackageJsonFile(source, dev),
  ]);
};

export default generateServer;
