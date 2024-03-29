import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

import open from 'open';
import blessed from 'blessed';

type Args = {
  logger: blessed.Widgets.Log;
  path: string;
  port: number;
  clientUrl: string;
};

export class ClientRunner {
  private logger: blessed.Widgets.Log;

  private path: string;

  private port: number;

  private process: ChildProcessWithoutNullStreams;

  private clientUrl: string;

  public constructor({ logger, path, port, clientUrl }: Args) {
    this.logger = logger;
    this.path = path;
    this.port = port;
    this.clientUrl = clientUrl;
  }

  public start = (): void => {
    this.stop();

    this.write('Starting client runner...');

    const installPackageProcess = this.installPackages();

    installPackageProcess.on('exit', (code: number) => {
      if (code === 0) {
        this.startClient();
      } else {
        this.write(`Failed to install packges.\nExited with code ${code}`);
      }
    });
  };

  public stop = (): void => {
    if (this.process) {
      this.write('Stopping client runner...');
      this.process.kill(9);
    }
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

  private startClient = () => {
    this.process = spawn('env', ['BROWSER=none', `PORT=${this.port}`, 'yarn', 'start'], {
      cwd: this.path,
    });

    this.process.stdout.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.stderr.on('data', (msg) => {
      this.write(msg.toString());
    });

    this.process.on('spawn', () => open(this.clientUrl));
  };

  private write = (msg: string): void => {
    this.logger.add(msg.replace(/\n$/, ''));
  };
}
