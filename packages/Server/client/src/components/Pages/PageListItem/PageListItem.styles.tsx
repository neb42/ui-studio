import styled from 'styled-components';
import Color from 'color';

interface IContainer {
  active: boolean;
}

export const Container = styled.div`
  margin: 8px;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 300ms;
  padding-left: 8px;
  padding-right: 4px;
  border-radius: 3px;

  background-color: ${({ active }: IContainer) =>
    active ? Color('#fa7268').alpha(0.4).hsl().string() : 'none'};

  &:hover {
    background-color: ${({ active }: IContainer) =>
      Color(active ? '#fa7268' : '#cfcfcf')
        .alpha(0.4)
        .hsl()
        .string()};
  }
`;
