// TODO This currently only supports packages published to npm
// It should handle anything valid in package.json dependencies

// Coded late at night, needs checking and things renaming

import * as os from 'os';
import path from 'path';
import https from 'https';

import * as fs from 'fs-extra';
import tar from 'tar';

type RawUIStudioConfig = {
  entryPoint: {
    path: string;
  };
  api: {
    path: string;
    openAPIEndpoint: string;
  };
  components: {
    path: string;
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

const getNpmVersion = async (name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/${name}`, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          const npmResponse = JSON.parse(body);
          resolve(npmResponse['dist-tags'].latest);
        });
      })
      .on('error', (err) => {
        reject(new Error(err.message));
      });
  });
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

const overwriteApi = (templateApiRoot: string, rootDir: string) => {
  const apiRoot = path.join(rootDir, 'api');
  fs.rmSync(apiRoot, { recursive: true, force: true });
  fs.copySync(templateApiRoot, apiRoot);
};

const updatePackageJSON = (
  name: string,
  version: string,
  config: RawUIStudioConfig,
  rootDir: string,
) => {
  const rootPackageJSONPath = path.join(rootDir, 'package.json');
  const rootPackageJSON = fs.readJsonSync(rootPackageJSONPath);
  fs.writeJSONSync(
    rootPackageJSONPath,
    {
      ...rootPackageJSON,
      uiStudio: {
        ...(rootPackageJSON.uiStudio || {}),
        openAPIEndpoint:
          config?.api?.openAPIEndpoint ?? rootPackageJSON?.uiStudio?.openAPIEndpoint ?? '',
        dependencies: {
          ...(rootPackageJSON.uiStudio.dependencies || {}),
          [name]: version,
        },
      },
    },
    { spaces: 2 },
  );
};

const handleFile = async (filePath: string, rootDir: string) => {
  const packageLocation = {
    fileType: filePath.match(/^.+\.(tgz|tar\.gz)$/) ? 'tar' : 'directory',
    location: 'file',
    uri: path.resolve(filePath),
  } as const;
  const tempDir = makeTempDir();
  const filesRoot = await extractFiles(packageLocation, tempDir);
  const templateJSON = readTemplateJSON(filesRoot);

  const packageJSON = readPackageJSON(filesRoot);
  const { name } = packageJSON;
  const version = `file:${filePath}`;
  updatePackageJSON(name, version, templateJSON, rootDir);

  if (templateJSON.api.path) {
    overwriteApi(path.join(filesRoot, templateJSON.api.path), rootDir);
  }
};

const handleNpm = async (template: string, rootDir: string) => {
  const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
  const scope = packageMatch[1] || '';
  const templateName = `uis-template-${packageMatch[2] || ''}`;
  let version = (packageMatch[3] || '').replace('@', '');

  const name = scope ? `${scope}/${templateName}` : templateName;

  if (!version) {
    version = await getNpmVersion(name);
  }

  const packageUrl = `https://registry.npmjs.org/${
    scope || templateName
  }/-/${templateName}-${version}.tgz`;

  const tempDir = makeTempDir();

  const packageLocation = {
    fileType: 'tar',
    location: 'npm',
    uri: packageUrl,
  } as const;

  const filesRoot = await extractFiles(packageLocation, tempDir);
  const templateJSON = readTemplateJSON(filesRoot);

  if (templateJSON?.components?.path || templateJSON?.entryPoint?.path) {
    updatePackageJSON(name, version, templateJSON, rootDir);
  }

  if (templateJSON?.api?.path) {
    overwriteApi(path.join(filesRoot, templateJSON?.api?.path), rootDir);
  }
};

export const mergeTemplate = async (template: string, rootDir: string): Promise<void> => {
  if (template.match(/^file:/)) {
    handleFile(template.match(/^file:(.*)?$/)[1], rootDir);
  } else if (template.includes('://')) {
    // TODO handle git urls
    throw new Error('Git urls are not currently supported');
  } else {
    handleNpm(template, rootDir);
  }
};
