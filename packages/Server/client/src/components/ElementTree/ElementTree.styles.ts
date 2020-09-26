import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  padding: 24px;
  box-shadow: 10px 0px 5px 0px rgba(28, 28, 28, 0.1);
`;

export const TreeItemLabel = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface ITreeItemActions {
  selected: boolean;
}

export const TreeItemActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-column-gap: 8px;
  transition: max-width 600ms;
  overflow: hidden;
  max-width: ${({ selected }: ITreeItemActions) => (selected ? '144px' : '0')};

  ${TreeItemLabel}:hover & {
    max-width: 144px;
  }
`;
