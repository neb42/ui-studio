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
  height: 55px;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};
`;

export const HeaderTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

export const VariableList = styled.div`
  background-color: ${({ theme }) => theme.colors.background.lightAlt};
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
    active ? Color(theme.colors.brand500).alpha(0.4).hsl().string() : 'none'};

  &:hover {
    background-color: ${({ active, theme }) =>
      Color(active ? theme.colors.brand500 : theme.colors.secondary300)
        .alpha(0.4)
        .hsl()
        .string()};
  }

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Name = styled.span``;

export const Actions = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-column-gap: 8px;
  transition: max-width 600ms;
  overflow: hidden;
  max-width: ${({ selected }) => (selected ? '144px' : '0')};

  ${VariableItem}:hover & {
    max-width: 144px;
  }
`;
