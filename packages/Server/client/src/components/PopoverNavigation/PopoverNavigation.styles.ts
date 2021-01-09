import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
`;

export const NavItem = styled.div`
  text-align: center;
  padding: 8px 0;
  background-color: grey;
`;

export const PopoverContainer = styled.div`
  height: 100vh;
  width: 50vw;
  position: fixed;
  bottom: 0;
  left: 25vw;
`;
