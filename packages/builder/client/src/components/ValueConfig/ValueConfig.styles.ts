import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #000;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
  padding: 16px;

  & .MuiSpeedDial-root {
    top: 16px;
    right: 16px;
  }
`;

export const Name = styled.span`
  margin-bottom: 8px;
`;

export const ValueItem = styled.span<{ root?: boolean; direction: 'row' | 'column' }>`
  display: flex;
  ${({ direction }) =>
    direction === 'row'
      ? css`
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        `
      : css`
          flex-direction: column;
          gap: 8px;
        `}

  ${({ root }) =>
    root
      ? css`
          border-left: 6px solid #00000025;
          padding: 4px;
        `
      : ''}
`;
