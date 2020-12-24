import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #1c1c1c;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

export const VariableItem = styled.div<any>`
  padding: 4px 8px;

  background-color: ${({ active }) =>
    active ? Color('#fa7268').alpha(0.4).hsl().string() : 'none'};

  &:hover {
    background-color: ${({ active }) =>
      Color(active ? '#fa7268' : '#cfcfcf')
        .alpha(0.4)
        .hsl()
        .string()};
  }
`;

export const Name = styled.div``;
