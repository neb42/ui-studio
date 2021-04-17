# `@ui-studio/typescript`

Typescipt utitilies for writing UI Studio Functions and Actions

## Usage

```
import { Function, Action, UIStudio } from '@ui-studio/typescript';

export default class Functions extends UIStudio {
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
