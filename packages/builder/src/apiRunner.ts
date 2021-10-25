import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

import blessed from 'blessed';

type Args = {
  logger: blessed.Widgets.Log;
  path: string;
  port: number;
};

export class ApiRunner {
  private logger: blessed.Widgets.Log;

  private path: string;

  private port: number;

  private process: ChildProcessWithoutNullStreams;

  public constructor({ logger, path, port }: Args) {
    this.logger = logger;
    this.path = path;
    this.port = port;
  }

  public start = (): void => {
    this.stop();

    this.write('Starting api runner...');

    this.process = spawn('yarn', ['api:start', '-p', this.port.toString()], { cwd: this.path });

    this.process.stdout.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.stderr.on('data', (msg) => {
      this.write(msg.toString());
    });
  };

  public stop = (): void => {
    if (this.process) {
      this.write('Stopping api runner...');
      spawn('yarn', ['api:stop'], { cwd: this.path }).on('exit', () => {
        this.process.kill(9);
      });
    }
  };

  private write = (msg: string): void => {
    this.logger.add(msg.replace(/\n$/, ''));
  };
}
