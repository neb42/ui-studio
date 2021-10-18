import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  height: 55px;
  padding: ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(4)}px;
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};

  & .Select {
    min-width: 100px;
  }

  & button {
    padding: ${({ theme }) => theme.spacing(2)}px;
  }
`;
