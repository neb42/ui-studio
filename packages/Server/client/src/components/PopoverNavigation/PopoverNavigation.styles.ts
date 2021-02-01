import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary900};
`;

export const NavItem = styled.div<{ active: boolean }>`
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  transition: background-color 300ms;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.brand300 : theme.colors.background.light};
  border-top: 3px solid ${({ theme }) => theme.colors.secondary900};
`;

export const PopoverContainer = styled.div`
  height: calc(100vh - 55px);
  width: 50vw;
  position: fixed;
  bottom: 0;
  left: 25vw;
`;
