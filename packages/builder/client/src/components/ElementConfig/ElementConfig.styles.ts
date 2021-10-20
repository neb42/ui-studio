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
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};
`;

export const ComponentName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: 16px;
`;

export const Body = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 16px;
  padding: 24px 16px;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.background.lightAlt};
`;
