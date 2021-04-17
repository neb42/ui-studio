import * as path from 'path';

export const FilePaths = {
  base: '',
  client: '',
  clientSrc: '',
  components: '',
  reducers: '',
  pages: '',
  public: '',
  server: '',
  serverSrc: '',
};
FilePaths.base = path.join(process.cwd(), '.ui-studio');

FilePaths.client = path.join(FilePaths.base, 'client');
FilePaths.public = path.join(FilePaths.client, 'public');
FilePaths.clientSrc = path.join(FilePaths.client, 'src');
FilePaths.components = path.join(FilePaths.clientSrc, 'components');
FilePaths.reducers = path.join(FilePaths.clientSrc, 'reducers');
FilePaths.pages = path.join(FilePaths.clientSrc, 'pages');

FilePaths.server = path.join(FilePaths.base, 'server');
FilePaths.serverSrc = path.join(FilePaths.server, 'src');
