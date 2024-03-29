// TODO This currently only supports packages published to npm
// It should handle anything valid in package.json dependencies

// Coded late at night, needs checking and things renaming

import * as os from 'os';
import path from 'path';
import https from 'https';

import * as fs from 'fs-extra';
import tar from 'tar';

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

type PackageLocation = {
  fileType: 'directory' | 'tar';
  location: 'npm' | 'file';
  uri: string;
};

const error = (message: string) => {
  console.log(message);
  process.exit(1);
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
  const absoluteFilePath = path.join(process.cwd(), filePath);
  const packageLocation = {
    fileType: filePath.match(/^.+\.(tgz|tar\.gz)$/) ? 'tar' : 'directory',
    location: 'file',
    uri: absoluteFilePath,
  } as const;
  const tempDir = makeTempDir();
  const filesRoot = await extractFiles(packageLocation, tempDir);
  const templateJSON = readTemplateJSON(filesRoot);

  const packageJSON = readPackageJSON(filesRoot);
  const { name } = packageJSON;
  const version = `file:${packageLocation.uri}`;
  updatePackageJSON(name, version, templateJSON, rootDir);

  if (templateJSON?.api?.path) {
    overwriteApi(path.join(filesRoot, templateJSON.api.path), rootDir);
  }
};

const handleNpm = async (template: string, rootDir: string) => {
  const match = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
  const scope = match[1] || '';
  const requestedName = match[2] || '';
  const requestedVersion = (match[3] || '').replace('@', '');

  if (requestedName.length === 0) error('');

  const name = requestedName.startsWith('uis-template-')
    ? requestedName
    : `uis-template-${requestedName}`;

  const packageName = `${scope}${name}`;

  const { version, tarUrl } = await getNpmVersion(packageName, requestedVersion);

  const tempDir = makeTempDir();

  const packageLocation = {
    fileType: 'tar',
    location: 'npm',
    uri: tarUrl,
  } as const;

  const filesRoot = await extractFiles(packageLocation, tempDir);
  const templateJSON = readTemplateJSON(filesRoot);

  if (templateJSON?.components?.path || templateJSON?.entryPoint?.path) {
    updatePackageJSON(packageName, version, templateJSON, rootDir);
  }

  if (templateJSON?.api?.path) {
    overwriteApi(path.join(filesRoot, templateJSON?.api?.path), rootDir);
  }
};

export const mergeTemplate = async (template: string, rootDir: string): Promise<void> => {
  if (template.match(/^file:/)) {
    return handleFile(template.match(/^file:(.*)?$/)[1], rootDir);
  }
  if (template.includes('://')) {
    // TODO handle git urls
    throw new Error('Git urls are not currently supported');
  } else {
    return handleNpm(template, rootDir);
  }
};
