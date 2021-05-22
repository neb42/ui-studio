import styled from 'styled-components';

export const SegmentedControl = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  height: 24px;
  position: relative;
`;

export const HiddenRadio = styled.input`
  position: absolute;
  left: -10000px;
  opacity: 0;
`;

export const Label = styled.label<{ count: number; rotate: boolean }>`
  width: ${({ count }) => 100 / count}%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    ${({ rotate }) => (rotate ? 'transform: rotate(90deg) scaleY(-1);' : '')}
  }
`;

export const ActiveSegment = styled.div<{ count: number; activeIdx: number; rotate: boolean }>`
  height: 100%;
  width: ${({ count }) => 100 / count}%;
  background-color: ${({ theme }) => theme.colors.primary};
  position: absolute;
  left: ${({ count, activeIdx }) => (100 * activeIdx) / count}%;
  transition: left 300ms;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & svg {
    ${({ rotate }) => (rotate ? 'transform: rotate(90deg) scaleY(-1);' : '')}
  }
`;
