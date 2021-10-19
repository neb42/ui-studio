import Color from 'color';
import styled from 'styled-components';

export const Container = styled.div``;

export const Event = styled.div`
  display: grid;
  grid-template-columns: auto 30px;
  align-items: center;
  row-gap: 8px;
  border: 1px solid #000;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;

  & > * {
    grid-column: 1/-1;
  }

  & > *:nth-child(1) {
    grid-column: 1;
  }

  & > *:nth-child(2) {
    grid-column: 2;
  }
`;

export const EventLabel = styled.div`
  font-weight: 500;
`;

export const EventInstance = styled.div`
  display: grid;
  grid-template-columns: auto 30px;
  column-gap: 16px;
  align-items: center;

  border-left: 6px solid ${({ theme }) => theme.palette.info.light};
  padding: 4px;
  padding-top: 0;

  transition: background-color 300ms, border-color 300ms;

  &:hover {
    background-color: ${({ theme }) => Color(theme.palette.info.light).alpha(0.3).hsl().string()};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.light};
    background-color: ${({ theme }) => Color(theme.palette.info.light).alpha(0.3).hsl().string()};
  }

  & button {
    margin-top: 4px;
  }

  & > * {
    grid-column: 1;
  }

  & > *:nth-child(1) {
    grid-row: 1;
    grid-column: 2;
  }

  & > *:nth-child(2) {
    grid-row: 1;
    grid-column: 1;
  }
`;
