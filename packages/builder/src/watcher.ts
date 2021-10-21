import * as fs from 'fs';
import { join } from 'path';

import { ClientRunner } from './clientRunner';
import { ComponentsRunner } from './componentsRunner';

type Args = {
  path: string;
  clientRunner: ClientRunner;
  componentsRunner: ComponentsRunner;
};

export class Watcher {
  packageJSONWatcher: fs.FSWatcher;

  srcWatcher: fs.FSWatcher;

  clientRunner: ClientRunner;

  componentsRunner: ComponentsRunner;

  path: string;

  constructor({ path, clientRunner, componentsRunner }: Args) {
    this.path = path;
    this.clientRunner = clientRunner;
    this.componentsRunner = componentsRunner;
  }

  public watch = (): void => {
    this.watchPackageJSON();
    this.watchSrc();
  };

  private watchPackageJSON = (): void => {
    this.packageJSONWatcher = fs.watch(join(this.path, 'package.json'), async () => {
      this.componentsRunner.stop();
      this.clientRunner.stop();
      await this.componentsRunner.run();
      this.clientRunner.start();
    });
  };

  private watchSrc = (): void => {
    this.srcWatcher = fs.watch(join(this.path, 'src'), { recursive: true }, async () => {
      this.componentsRunner.stop();
      this.clientRunner.stop();
      await this.componentsRunner.run();
      this.clientRunner.start();
    });
  };
}
