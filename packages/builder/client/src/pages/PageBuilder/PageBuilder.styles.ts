import styled, { css, keyframes } from 'styled-components';
import deepPurple from '@mui/material/colors/deepPurple';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
`;

const pulse = keyframes`
  0% {
      background-position: 100% 0%
  }
  100% {
      background-position: 15% 100%
  }
`;

export const Body = styled.div<{ loading: boolean }>`
  display: grid;
  grid-template-columns: 48px 300px 1fr 300px;
  overflow: hidden;
  ${({ loading }) =>
    loading
      ? css`
          background: ${deepPurple[300]};
          background: linear-gradient(
            45deg,
            ${deepPurple[300]} 0%,
            ${deepPurple[100]} 33%,
            ${deepPurple[300]} 66%,
            ${deepPurple[100]} 100%
          );
          background-size: 400% 400%;
          animation: ${pulse} 5s linear infinite;
        `
      : ''}
`;

export const ColLeft = styled.div`
  border-right: 1px solid ${({ theme }) => theme.palette.info.main};
`;

export const PopoverContainer = styled.div`
  height: calc(100vh - 49px);
  width: calc(100vw - 600px - 48px);
  position: fixed;
  left: 348px;
  top: calc(49px);
  background-color: ${({ theme }) => theme.colors.background.light};
`;
