export interface TreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'layout' | 'widget';
  children: TreeNode[];
}