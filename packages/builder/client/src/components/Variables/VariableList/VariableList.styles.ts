import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  grid-column: 1/-1;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.background.default};
  box-shadow: 0 4px 6px -6px ${({ theme }) => theme.palette.info.main};
`;

export const VariableList = styled.div`
  background-color: ${({ theme }) => theme.background.alt};
  overflow: auto;
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const VariableItem = styled.div<{ active: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: background-color 300ms;
  padding: 8px;
  border-radius: 3px;

  background-color: ${({ active, theme }) =>
    active ? Color(theme.palette.primary.main).alpha(0.08).hsl().string() : 'none'};

  color: ${({ active, theme }) => (active ? theme.palette.primary.main : 'rgba(0,0,0,0.54)')};

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? Color(theme.palette.primary.main).alpha(0.08).hsl().string() : 'rgba(0,0,0,0.04)'};
  }

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Actions = styled.div<{ selected: boolean }>`
  transition: max-width 600ms;
  overflow: hidden;
  max-width: ${({ selected }) => (selected ? '144px' : '0')};

  ${VariableItem}:hover & {
    max-width: 144px;
  }
`;
