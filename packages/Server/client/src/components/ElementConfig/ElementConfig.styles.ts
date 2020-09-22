import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-shadow: -10px 0px 5px 0px rgba(28, 28, 28, 0.1);
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 16px;
  padding: 16px 24px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.dark};
`;

export const ComponentName = styled.span`
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  color: #fff;
`;

export const Name = styled.div`
  padding: 16px 24px;
`;

export const Field = styled.div`
  flex-grow: 1;
  overflow: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 16px;
  padding: 24px;
`;
