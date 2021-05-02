export interface TreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'customComponent' | 'widget';
  children: TreeNode[];
}
