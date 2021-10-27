import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  height: 100%;
`;

export const Header = styled.div`
  padding: 8px 16px;
  background-color: #1c1c1c;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

export const Tree = styled.div`
  padding: 16px;
  height: calc(100vh - 49px - 68px);
  overflow: auto;
  background-color: ${({ theme }) => theme.background.alt};
`;

export const TreeItemLabel = styled.div<{ active: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: background-color 300ms;
  padding-left: 8px;
  padding-right: 4px;
  border-radius: 3px;

  background-color: ${({ active, theme }) =>
    active ? Color(theme.palette.primary.main).alpha(0.08).hsl().string() : 'none'};

  color: ${({ active, theme }) => (active ? theme.palette.primary.main : 'rgba(0,0,0,0.54)')};

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? Color(theme.palette.primary.main).alpha(0.08).hsl().string() : 'rgba(0,0,0,0.04)'};
  }

  & > svg:first-of-type {
    fill: ${({ theme, active }) => (active ? theme.palette.primary.main : 'rgba(0,0,0,0.54)')};
  }

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const TreeItemActions = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, auto);
  /* grid-column-gap: 8px; */
  transition: max-width 600ms;
  overflow: hidden;
  max-width: ${({ selected }) => (selected ? '144px' : '0')};

  ${TreeItemLabel}:hover & {
    max-width: 144px;
  }
`;

export const ElementName = styled.span`
  font-size: 16px;
`;
