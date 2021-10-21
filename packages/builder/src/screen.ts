import blessed from 'blessed';
import figlet from 'figlet';

export class Screen {
  private screen: blessed.Widgets.Screen;

  public topLeft: blessed.Widgets.BoxElement;

  public topRight: blessed.Widgets.Log;

  public bottomLeft: blessed.Widgets.Log;

  public bottomRight: blessed.Widgets.Log;

  public constructor() {
    this.screen = this.createScreen('UI Studio');

    this.topLeft = this.createBox('0%', '0%');
    this.topRight = this.createLog('0%', '50%');
    this.bottomLeft = this.createLog('50%', '0%');
    this.bottomRight = this.createLog('50%', '50%');

    figlet('\n UI Studio', { font: 'ANSI Regular' }, (err, data) => {
      if (!err) this.topLeft.setContent(data);
      this.screen.render();
    });
  }

  private createScreen = (title: string): blessed.Widgets.Screen => {
    const screen = blessed.screen({
      smartCSR: true,
    });

    screen.title = title;

    screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0);
    });

    return screen;
  };

  private createLog = (top: string, left: string): blessed.Widgets.Log => {
    return blessed.log({
      top,
      left,
      parent: this.screen,
      width: '50%',
      height: '50%',
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        border: {
          fg: '#f0f0f0',
        },
        hover: {
          bg: 'green',
        },
      },
      tags: true,
      mouse: true,
      keys: true,
      vi: true,
      alwaysScroll: true,
      scrollable: true,
      scrollbar: {
        style: {
          bg: 'yellow',
        },
      },
    });
  };

  private createBox = (top: string, left: string): blessed.Widgets.BoxElement => {
    return blessed.box({
      top,
      left,
      parent: this.screen,
      width: '50%',
      height: '50%',
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        border: {
          fg: '#f0f0f0',
        },
        hover: {
          bg: 'green',
        },
      },
      tags: true,
      mouse: true,
      keys: true,
      vi: true,
      alwaysScroll: true,
      scrollable: true,
      scrollbar: {
        style: {
          bg: 'yellow',
        },
      },
    });
  };
}
