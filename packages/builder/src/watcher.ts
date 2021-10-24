import * as fs from 'fs';
import { join } from 'path';

import { ClientRunner } from './clientRunner';
import { ComponentsRunner } from './componentsRunner';
import { Server } from './server';

type Args = {
  path: string;
  clientRunner: ClientRunner;
  componentsRunner: ComponentsRunner;
  server: Server;
};

export class Watcher {
  packageJSONWatcher: fs.FSWatcher;

  srcWatcher: fs.FSWatcher;

  apiWatcher: fs.FSWatcher;

  clientRunner: ClientRunner;

  componentsRunner: ComponentsRunner;

  server: Server;

  path: string;

  constructor({ path, clientRunner, componentsRunner, server }: Args) {
    this.path = path;
    this.clientRunner = clientRunner;
    this.componentsRunner = componentsRunner;
    this.server = server;
  }

  public watch = (): void => {
    this.watchPackageJSON();
    this.watchSrc();
    this.watchApi();
  };

  public stop = (): void => {
    if (this.packageJSONWatcher) this.packageJSONWatcher.close();
    if (this.srcWatcher) this.srcWatcher.close();
    if (this.apiWatcher) this.apiWatcher.close();
  };

  private watchPackageJSON = (): void => {
    this.packageJSONWatcher = fs.watch(join(this.path, 'package.json'), async () => {
      await this.componentsRunner.run();
      this.server.reloadComponents();
    });
  };

  private watchSrc = (): void => {
    this.srcWatcher = fs.watch(join(this.path, 'src'), { recursive: true }, async () => {
      await this.componentsRunner.run();
      this.server.reloadComponents();
    });
  };

  private watchApi = (): void => {
    this.apiWatcher = fs.watch(join(this.path, 'api'), { recursive: true }, async () => {
      this.server.reloadOpenApiSpec();
    });
  };
}
