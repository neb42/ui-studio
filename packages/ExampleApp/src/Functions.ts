import { Function, Action, UIBuilder } from '@ui-builder/typescript';

export class Functions extends UIBuilder {
  @Function()
  foo(w_widget1: boolean, arg2: string): number {
    return 10;
  };

  @Function()
  bar(repeat: number): string {
    return 'Hello world'.repeat(repeat);
  };

  @Function()
  baz(repeat: number): { [key: string]: number } {
    return {
      a: 1,
      b: 2,
      c: 3,
    };
  };

  @Action()
  doSomething(input: string) {
    console.log('Writing to database', input);
  }
}