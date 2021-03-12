# `canvas-typescript`

Typescipt utitilies for writing canvas Functions and Actions

## Usage

```
import { Function, Action, Canvas } from 'canvas-typescript';

export default class Functions extends Canvas {
  @Function()
  exampleFunction(): string {
    return '';
  }

  @Action()
  exampleAction() {
    return;
  }
}
```
