import styled from 'styled-components';
import { ScreenSize } from 'types/store';

const screenSizeToWidthMap = {
  monitor: '100%',
  laptop: '1024px',
  tablet: '720px',
  mobile: '320px',
};

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.secondary900};
`;

export const Iframe = styled.iframe<{ previewSize: ScreenSize }>`
  width: ${({ previewSize }) => screenSizeToWidthMap[previewSize]};
  max-width: 100%;
  margin: auto;
  height: 100%;
  border: none;
  display: block;
`;
