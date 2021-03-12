export interface TreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'widget';
  children: TreeNode[];
}
