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
    this.process = spawn('yarn', ['api:dev', '-p', this.port.toString()], { cwd: this.path });

    this.process.stdout.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.stderr.on('data', (msg) => {
      this.write(msg.toString());
    });
  };

  public stop = (): void => {
    // this.process.stdin.pause();
    this.process.kill();
  };

  private write = (msg: string): void => {
    this.logger.add(msg.replace(/\n$/, ''));
  };
}
