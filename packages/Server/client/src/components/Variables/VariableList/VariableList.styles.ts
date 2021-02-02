import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  overflow: auto;
`;

export const VariableItem = styled.div<{ active: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: background-color 300ms;
  padding-left: 8px;
  padding-right: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 3px;

  background-color: ${({ active }) =>
    active ? Color('#fa7268').alpha(0.4).hsl().string() : 'none'};

  &:hover {
    background-color: ${({ active }) =>
      Color(active ? '#fa7268' : '#cfcfcf')
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
