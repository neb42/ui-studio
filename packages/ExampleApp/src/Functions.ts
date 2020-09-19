const Function = (): any => {
  return (target: Functions, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (!target.registered) target.registered = [];
    target.registered.push({ name: propertyKey, args: [] });
  };
};

interface IRegistered {
  name: string;
  args: string[][];
}

export class Functions {
  registered: IRegistered[];

  @Function()
  public foo = (w_widget1) => {
    return 10;
  };

  @Function()
  public bar = (w_widget1) => {
    return 'Hello world';
  };
}