import styled from 'styled-components';

export const Container = styled.div``;

export const Event = styled.div`
  display: grid;
  grid-template-columns: auto 30px;
  align-items: center;
  row-gap: 8px;

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
  grid-template-columns: auto min-content;
  column-gap: 16px;
  align-items: center;
  padding: 8px;
  background-color: #fff;
  box-shadow: rgb(232 232 232) 0px 3px 2px 0px;

  & > *:nth-child(1) {
    grid-column: 2;
  }

  & > *:nth-child(2) {
    grid-row: 1;
    grid-column: 1;
  }

  & > *:nth-child(3) {
    grid-row: 2;
    grid-column: 1;
  }
`;
