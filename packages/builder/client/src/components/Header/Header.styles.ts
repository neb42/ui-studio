import styled from 'styled-components';
import deepPurple from '@mui/material/colors/deepPurple';

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.info.main};
  background: linear-gradient(to left, ${deepPurple[500]}, ${deepPurple[100]});

  & > *:nth-child(2) {
    justify-self: center;
  }
`;
