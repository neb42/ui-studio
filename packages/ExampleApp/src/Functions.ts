import "reflect-metadata";

const Function = (): any => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    if (!target.registered) target.registered = [];

    const functionString: string = target[propertyName].toString();
    const regex = new RegExp('^' + propertyName + '\\((.*)\\) {');
    const paramNames = functionString.match(regex)[1].replace(/ /g, '').split(',');

    const returnType = Reflect.getMetadata('design:returntype', target, propertyName)
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyName)
    target.registered.push({
      name: propertyName,
      returnType: returnType.name.toLowerCase(), 
      args: paramTypes.map((p, i) => ({
        name: paramNames[i],
        type: p.name.toLowerCase(),
      })),
    });
  };
};

interface IRegistered {
  name: string;
  returnType: 'string' | 'number' | 'boolean';
  args: { name: string, type: 'string' | 'number' | 'boolean' }[];
}

export class Functions {
  registered: IRegistered[];

  @Function()
  foo(w_widget1: boolean, arg2: string): number {
    return 10;
  };

  @Function()
  bar(w_widget1: number): string {
    return 'Hello world';
  };
}