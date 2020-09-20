import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  overflow: hidden;
  padding: 24px 0;
  box-shadow: -10px 0px 5px 0px rgba(28, 28, 28, 0.1);
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 16px;
  padding: 0 24px;
  margin-bottom: 16px;
  align-items: center;
`;

export const ComponentName = styled.span`
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

export const Field = styled.div`
  height: calc(100% - 24px);
  overflow: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 16px;
  padding: 24px;
`;
