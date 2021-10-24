import styled, { css, keyframes } from 'styled-components';
import deepPurple from '@mui/material/colors/deepPurple';
import { ScreenSize } from 'types/store';

const screenSizeToWidthMap = {
  monitor: '100%',
  laptop: '1024px',
  tablet: '720px',
  mobile: '320px',
};

const pulse = keyframes`
  0% {
      background-position: 100% 0%
  }
  100% {
      background-position: 15% 100%
  }
}
`;

export const Container = styled.div<{ loading: boolean }>`
  width: 100%;
  height: 100%;
  ${({ loading }) =>
    loading
      ? css`
          background: ${deepPurple[500]};
          background: linear-gradient(
            45deg,
            ${deepPurple[500]} 0%,
            ${deepPurple[100]} 33%,
            ${deepPurple[500]} 66%,
            ${deepPurple[100]} 100%
          );
          background-size: 400% 400%;
          animation: ${pulse} 5s linear infinite;
        `
      : ''}
`;

export const Iframe = styled.iframe<{ previewSize: ScreenSize }>`
  width: ${({ previewSize }) => screenSizeToWidthMap[previewSize]};
  max-width: 100%;
  margin: auto;
  height: 100%;
  border: none;
  display: block;
`;
