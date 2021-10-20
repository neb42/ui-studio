import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Cell = styled.div<{ showValueControl: boolean }>`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
  margin-bottom: 8px;
`;
