import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.palette.info.main};
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.background.default};
  box-shadow: 0 4px 6px -6px ${({ theme }) => theme.palette.info.main};
`;

export const Body = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 16px;
  padding: 24px;
  padding-left: 16px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background.alt};
`;
