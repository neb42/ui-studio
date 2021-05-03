import * as path from 'path';

class FilePathBuilder {
  app = '';

  base = '';

  client = '';

  clientSrc = '';

  components = '';

  reducers = '';

  pages = '';

  public = '';

  server = '';

  serverSrc = '';

  init = (root: string = process.cwd()) => {
    this.app = root;

    this.base = path.join(this.app, '.ui-studio');

    this.client = path.join(this.base, 'client');
    this.public = path.join(this.client, 'public');
    this.clientSrc = path.join(this.client, 'src');
    this.components = path.join(this.clientSrc, 'components');
    this.reducers = path.join(this.clientSrc, 'reducers');
    this.pages = path.join(this.clientSrc, 'pages');

    this.server = path.join(this.base, 'server');
    this.serverSrc = path.join(this.server, 'src');
  };
}

export const FilePaths = new FilePathBuilder();
