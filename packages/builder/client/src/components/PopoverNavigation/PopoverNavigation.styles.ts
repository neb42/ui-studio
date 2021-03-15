import styled, { keyframes } from 'styled-components';

export const SegmentedControl = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.brand500};
  height: 45px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const HiddenRadio = styled.input`
  position: absolute;
  left: -10000px;
  opacity: 0;
`;

export const Label = styled.label`
  width: 33%;
  text-align: center;
  margin: auto;
  cursor: pointer;
`;

export const ActiveSegment = styled.div<{ activeIdx: number; text: string }>`
  height: 100%;
  width: calc(100% / 3);
  background-color: ${({ theme }) => theme.colors.brand500};
  position: absolute;
  left: calc((100% * ${({ activeIdx }) => activeIdx}) / 3);
  transition: left 300ms;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:after {
    content: '${({ text }) => text}';
    transition: content 300ms;
    color: #fff;
  }
`;

const slideIn = keyframes`
  0% {
    top: 100vh;
  }
  100% {
    top: calc(55px + 100px);
  }
`;

export const PopoverContainer = styled.div`
  height: calc(100vh - 55px - 100px);
  width: calc(100vw - 600px);
  position: fixed;
  left: 300px;
  top: calc(55px + 100px);
  animation: 300ms ${slideIn} ease-out;
  background-color: ${({ theme }) => theme.colors.background.light};
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Mask = styled.div`
  height: calc(100vh - 55px);
  width: calc(100vw - 600px);
  position: fixed;
  bottom: 0;
  left: 300px;
  background-color: ${({ theme }) => theme.colors.mask};
  animation: 300ms ${fadeIn} ease-out;
`;
