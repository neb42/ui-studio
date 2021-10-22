// TODO This currently only supports packages published to npm
// It should handle anything valid in package.json dependencies

// Coded late at night, needs checking and things renaming

import * as os from 'os';
import path from 'path';
import https from 'https';

import * as fs from 'fs-extra';
import tar from 'tar';
import merge from 'lodash.merge';
import camelCase from 'lodash.camelcase';

type PackageLocation = {
  fileType: 'directory' | 'tar';
  location: 'npm' | 'file';
  uri: string;
};

const makeTempDir = (): string => {
  const dir = path.join(os.tmpdir(), 'ui-studio-');
  return fs.mkdtempSync(dir);
};

const getPackageLocation = (template: string): PackageLocation => {
  if (template.match(/^file:/)) {
    return {
      fileType: template.match(/^.+\.(tgz|tar\.gz)$/) ? 'tar' : 'directory',
      location: 'file',
      uri: template.match(/^file:(.*)?$/)[1],
    };
  }

  if (template.includes('://')) {
    // TODO handle git urls
    throw new Error('Git urls are not currently supported');
  }

  const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
  const scope = packageMatch[1] || '';
  const templateName = `uis-template-${packageMatch[2] || ''}`;
  const version = (packageMatch[3] || '').replace('@', '');

  const packageUrl = `https://registry.npmjs.org/${
    scope || templateName
  }/-/${templateName}-${version}.tgz`;

  return {
    fileType: 'tar',
    location: 'npm',
    uri: packageUrl,
  };
};

const downloadFile = async (url: string, fileFullPath: string) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        // chunk received from the server
        resp.on('data', (chunk) => {
          fs.appendFileSync(fileFullPath, chunk);
        });

        // last chunk received, we are done
        resp.on('end', () => {
          resolve(`File downloaded and stored at: ${fileFullPath}`);
        });
      })
      .on('error', (err) => {
        reject(new Error(err.message));
      });
  });
};

const extractFiles = async (packageLocation: PackageLocation, dir: string): Promise<string> => {
  const tarPath = path.join(dir, 'package.tgz');
  if (packageLocation.location === 'npm') {
    if (packageLocation.fileType !== 'tar') throw new Error('NPM package must be a tar');
    await downloadFile(packageLocation.uri, tarPath);
    await tar.extract({ file: tarPath, C: dir });
    return path.join(dir, 'package');
  }

  if (packageLocation.location === 'file') {
    if (packageLocation.fileType === 'tar') {
      fs.copyFileSync(packageLocation.uri, tarPath);
      await tar.extract({ file: tarPath, C: dir });
      return path.join(dir, 'package');
    }

    if (packageLocation.fileType === 'directory') {
      return packageLocation.uri;
    }

    throw new Error('Invalid file type');
  }

  throw new Error('Invalid package location');
};

const readPackageJSON = (rootDir: string) => fs.readJsonSync(path.join(rootDir, 'package.json'));

const readTemplateJSON = (rootDir: string) => fs.readJsonSync(path.join(rootDir, 'template.json'));

const mergePackageJSON = (
  templateName: string,
  templatePackage: any,
  rootDir: string,
  hasComponents: boolean,
) => {
  const rootPackageJSONPath = path.join(rootDir, 'package.json');
  const rootPackageJSON = fs.readJsonSync(rootPackageJSONPath);

  const template = (() => {
    const {
      name: _,
      private: __,
      version: ___,
      description: ____,
      license: ______,
      main: ________,
      // scripts,
      // dependencies,
      // devDependencies,
      // peerDependencies,
      uiStudio,
      ...other
    } = templatePackage;
    return {
      // scripts,
      // dependencies,
      // devDependencies,
      // peerDependencies,
      uiStudio,
      other,
    };
  })();

  const root = (() => {
    const {
      name,
      private: _private,
      version,
      description,
      license,
      main,
      // scripts,
      // dependencies,
      // devDependencies,
      // peerDependencies,
      uiStudio,
      ...other
    } = rootPackageJSON;
    return {
      name,
      private: _private,
      version,
      description,
      license,
      main,
      // scripts,
      // dependencies,
      // devDependencies,
      // peerDependencies,
      uiStudio,
      other,
    };
  })();

  const mergedUIStudio = merge(root.uiStudio || {}, template.uiStudio || {});

  const merged = {
    name: root.name,
    private: root.private,
    version: root.version,
    description: root.description,
    license: root.license,
    main: root.main,
    ...merge(root.other, template.other),
    uiStudio: hasComponents
      ? {
          ...mergedUIStudio,
          componentPackages: [...mergedUIStudio.componentPackages, templateName],
        }
      : mergedUIStudio,
  };

  fs.writeJsonSync(rootPackageJSONPath, merged, { spaces: 2 });
};

const mergeComponents = (templateComponentsRoot: string, rootDir: string) => {
  const rootComponentsRoot = path.join(rootDir, 'src', 'Components');
  fs.ensureDirSync(rootComponentsRoot);
  fs.copySync(templateComponentsRoot, rootComponentsRoot);
};

const overwriteApi = (templateApiRoot: string, rootDir: string) => {
  const apiRoot = path.join(rootDir, 'api');
  fs.rmSync(apiRoot, { recursive: true, force: true });
  fs.copySync(templateApiRoot, apiRoot);
};

const copyEntryPoint = (entryPointPath: string, packageName: string, rootDir: string) => {
  const appDir = path.join(rootDir, 'src', 'App');
  const fileName = `EP${camelCase(packageName)}.tsx`;
  fs.ensureDirSync(appDir);
  fs.copyFileSync(entryPointPath, path.join(appDir, fileName));
};

export const mergeTemplate = async (template: string, rootDir: string): Promise<void> => {
  const tempDir = makeTempDir();
  const packageLocation = getPackageLocation(template);
  const filesRoot = await extractFiles(packageLocation, tempDir);
  const packageJSON = readPackageJSON(filesRoot);
  const templateJSON = readTemplateJSON(filesRoot);

  mergePackageJSON(
    packageJSON.name,
    templateJSON.package || {},
    rootDir,
    templateJSON.componentsDir && templateJSON.componentsDir.length > 0,
  );

  if (templateJSON.componentsDir) {
    mergeComponents(path.join(filesRoot, templateJSON.componentsDir), rootDir);
  }

  if (templateJSON.apiDir) {
    overwriteApi(path.join(filesRoot, templateJSON.apiDir), rootDir);
  }

  if (templateJSON.entryPoint) {
    copyEntryPoint(
      path.join(filesRoot, templateJSON.entryPoint),
      template.split('/').slice(-1)[0],
      rootDir,
    );
  }
};
