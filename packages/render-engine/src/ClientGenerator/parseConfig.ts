import * as os from 'os';
import path from 'path';
import https from 'https';

import * as fs from 'fs-extra';
import tar from 'tar';
import camelCase from 'lodash.camelcase';

type RawUIStudioConfig = {
  entryPoint?: {
    path?: string;
  };
  api?: {
    path?: string;
    openAPIEndpoint?: string;
  };
  components?: {
    path?: string;
  };
};

export type UIStudioConfig = {
  dependencies: {
    [name: string]: {
      name: string;
      version: string;
      cleanName: string;
      entryPointImportPath: string | null;
      componentsImportPath: string | null;
    };
  };
};

type PackageLocation = {
  fileType: 'directory' | 'tar';
  location: 'npm' | 'file';
  uri: string;
};

const makeTempDir = (): string => {
  const dir = path.join(os.tmpdir(), 'ui-studio-');
  return fs.mkdtempSync(dir);
};

const getNpmVersion = async (
  name: string,
  version?: string | null,
): Promise<{ version: string; tarUrl: string }> => {
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/${name}`, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          const npmResponse = JSON.parse(body);
          const v = version || npmResponse['dist-tags'].latest;
          resolve({
            version: v,
            tarUrl: npmResponse.versions[v].dist.tarball,
          });
        });
      })
      .on('error', (err) => {
        reject(new Error(err.message));
      });
  });
};

const getPackageLocation = async (name: string, version: string): Promise<PackageLocation> => {
  if (version.match(/^file:/)) {
    return {
      fileType: version.match(/^.+\.(tgz|tar\.gz)$/) ? 'tar' : 'directory',
      location: 'file',
      uri: path.resolve(version.match(/^file:(.*)?$/)[1]),
    };
  }

  if (version.includes('://')) {
    // TODO handle git urls
    throw new Error('Git urls are not currently supported');
  }

  const packageMatch = name.match(/^(@[^/]+\/)?([^@]+)?$/);
  const scope = packageMatch[1] || '';
  const rawPackageName = packageMatch[2] || '';
  const packageName = rawPackageName.startsWith('uis-template-')
    ? rawPackageName
    : `uis-template-${rawPackageName}`;

  const { tarUrl } = await getNpmVersion(`${scope}${packageName}`, version);

  return {
    fileType: 'tar',
    location: 'npm',
    uri: tarUrl,
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

const readTemplateJSON = (rootDir: string): RawUIStudioConfig =>
  fs.readJsonSync(path.join(rootDir, 'template.json'));

export const parseConfig = async (source: string): Promise<UIStudioConfig> => {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(source, 'package.json')).toString());
  const dependencies = await Object.entries(pkgJson.uiStudio.dependencies).reduce<
    Promise<UIStudioConfig['dependencies']>
  >(async (acc, [name, version]) => {
    const tempDir = makeTempDir();
    const packageLocation = await getPackageLocation(name, version as string);
    const filesRoot = await extractFiles(packageLocation, tempDir);
    const packageJSON = readPackageJSON(filesRoot);
    const templateJSON = readTemplateJSON(filesRoot);
    return {
      ...acc,
      [packageJSON.name]: {
        name: packageJSON.name,
        version,
        cleanName: camelCase(packageJSON.name).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        entryPointImportPath: templateJSON?.entryPoint?.path
          ? path.join(packageJSON.name, templateJSON.entryPoint.path.replace(/\.tsx?$/, ''))
          : null,
        componentsImportPath: templateJSON?.components?.path
          ? path.join(packageJSON.name, templateJSON.components.path.replace(/\.tsx?$/, ''))
          : null,
      },
    };
  }, Promise.resolve({}));

  return { dependencies };
};
