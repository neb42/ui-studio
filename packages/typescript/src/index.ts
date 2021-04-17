/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import 'reflect-metadata';
import { Component } from '@ui-studio/types';

const getFunctionRegexMatch = (functionString: string, propertyName: string): RegExpMatchArray => {
  const regexFirstAttempt = new RegExp(`^${propertyName}\\((.*)\\) {`);
  const matchFirstAttempt = functionString.match(regexFirstAttempt);
  if (matchFirstAttempt) return matchFirstAttempt;
  const regexSecondAttempt = new RegExp(`^${propertyName})'^function\\s?\\((.*)\\) {')`);
  const matchSecondAttempt = functionString.match(regexSecondAttempt);
  return matchSecondAttempt;
};

export const Function = (): any => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor): void => {
    if (!target.registered) target.registered = {};
    if (!target.registered.functions) target.registered.functions = [];

    const functionString: string = target[propertyName].toString();
    const regexMatch = getFunctionRegexMatch(functionString, propertyName);
    const paramNames = regexMatch[1].replace(/ /g, '').split(',');

    const returnType = Reflect.getMetadata('design:returntype', target, propertyName);
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyName);
    target.registered.functions.push({
      name: propertyName,
      returnType: returnType ? returnType.name.toLowerCase() : 'object',
      args: paramTypes.map((p, i) => ({
        name: paramNames[i],
        type: p.name.toLowerCase(),
      })),
    });
  };
};

export const Action = (): any => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor): void => {
    if (!target.registered) target.registered = {};
    if (!target.registered.actions) target.registered.actions = [];

    const functionString: string = target[propertyName].toString();
    const regexMatch = getFunctionRegexMatch(functionString, propertyName);
    const paramNames = regexMatch[1].replace(/ /g, '').split(',');

    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyName);
    target.registered.actions.push({
      name: propertyName,
      args: paramTypes.map((p, i) => ({
        name: paramNames[i],
        type: p.name.toLowerCase(),
      })),
    });
  };
};

interface RegisteredFunctions {
  name: string;
  returnType: 'string' | 'number' | 'boolean' | 'object';
  args: { name: string; type: 'string' | 'number' | 'boolean' }[];
}

interface RegisteredActions {
  name: string;
  args: { name: string; type: 'string' | 'number' | 'boolean' }[];
}

export class UIStudio {
  registered: {
    functions: RegisteredFunctions[];
    actions: RegisteredActions[];
  };
}

export const parseComponents = (
  components: (Component & {
    component: any;
  })[],
): Record<
  string,
  Component & {
    component: any;
  }
> =>
  components.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.key]: cur,
    }),
    {},
  );
