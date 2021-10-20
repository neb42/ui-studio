import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.info.main};
  background-image: linear-gradient(
    to bottom left,
    ${({ theme }) => theme.palette.primary.light}80,
    #fff
  );

  & > *:nth-child(2) {
    justify-self: center;
  }
`;
