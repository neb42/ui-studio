import styled from 'styled-components';
import deepPurple from '@mui/material/colors/deepPurple';

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.info.main};
  /* background-image: linear-gradient(
    to bottom left,
    ${({ theme }) => theme.palette.primary.light}80,
    #fff
  ); */
  /* background: linear-gradient(to left, #03001e, #7303c0, #ec38bc, #fdeff9); */
  /* background: linear-gradient(to left, #8364e8, #d397fa); */
  background: linear-gradient(to left, ${deepPurple[500]}, ${deepPurple[100]});

  & > *:nth-child(2) {
    justify-self: center;
  }
`;
