import * as FunctionsPkg from 'functions-pkg';

export const Components: {
  [library: string]: { [component: string]: { component: React.FC<any> } };
} = {
  custom: FunctionsPkg.Components,
  'functions-pkg': FunctionsPkg.Components,
};
