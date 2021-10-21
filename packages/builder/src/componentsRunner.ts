import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

import blessed from 'blessed';

type Args = {
  logger: blessed.Widgets.Log;
  path: string;
};

export class ComponentsRunner {
  private logger: blessed.Widgets.Log;

  private process: ChildProcessWithoutNullStreams;

  private path: string;

  private running = false;

  constructor({ logger, path }: Args) {
    this.logger = logger;
    this.path = path;
  }

  public run = (): Promise<void> => {
    this.running = true;

    const installPackageProcess = this.installPackages();

    installPackageProcess.on('exit', (code: number) => {
      if (code === 0) {
        this.buildComponents();
      } else {
        this.running = false;
        this.write(`Failed to build packages.\nExited with code ${code}`);
      }
    });

    return this.wait();
  };

  // This process should run and finish, hence this shouldn't be neccassery
  public stop = (): void => {
    // this.process.stdin.pause();
    this.process.kill();
  };

  private wait = (ms = 2000): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.running) {
          resolve();
          clearInterval(interval);
        }
      }, ms);
    });
  };

  private installPackages = (): ChildProcessWithoutNullStreams => {
    this.process = spawn('yarn', ['--force', '--prefer-offline'], {
      cwd: this.path,
    });

    this.process.stdout.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.stderr.on('data', (msg) => {
      this.write(msg.toString());
    });

    return this.process;
  };

  private buildComponents = () => {
    this.process = spawn('yarn', ['build'], {
      cwd: this.path,
    });

    this.process.stdout.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.stderr.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.on('exit', (code: number) => {
      if (code !== 0) {
        this.write(`Failed to build packages.\nExited with code ${code}`);
      }
      this.running = false;
    });
  };

  private write = (msg: string): void => {
    this.logger.add(msg.replace(/\n$/, ''));
  };
}
