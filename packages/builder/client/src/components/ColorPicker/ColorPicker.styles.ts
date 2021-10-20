import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 16px 1fr auto auto;
  align-items: center;
  row-gap: 8px;
  column-gap: 8px;
`;

export const ColorPickerWrapper = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: ${({ y }) => y}px;
  right: calc(100vw - ${({ x }) => x}px);
`;

export const Swatch = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

export const Value = styled.div`
  color: ${({ theme }) => theme.colors.grey700};
  text-transform: uppercase;
  font-family: ${({ theme }) => theme.fonts.family.code};
`;
