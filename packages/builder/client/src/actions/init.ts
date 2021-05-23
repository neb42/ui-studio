import { Store$Configuration, Store$Tree, Store$Variable } from 'types/store';

export interface InitClient {
  type: 'INIT_CLIENT';
  payload: {
    tree: Store$Tree;
    variables: Store$Variable;
    colors: Store$Configuration['colors'];
  };
}

export const INIT_CLIENT = 'INIT_CLIENT';

export const initClient = (client: {
  tree: Store$Tree;
  variables: Store$Variable;
  colors: Store$Configuration['colors'];
}): InitClient => ({
  type: INIT_CLIENT,
  payload: client,
});
