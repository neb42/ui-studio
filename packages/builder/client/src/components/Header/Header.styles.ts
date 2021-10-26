import styled from 'styled-components';
import deepPurple from '@mui/material/colors/deepPurple';

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.info.main};
  background: linear-gradient(to right, #fff 0%, ${deepPurple[100]} 30%, ${deepPurple[500]} 100%);

  & > *:nth-child(2) {
    justify-self: center;
  }
`;
