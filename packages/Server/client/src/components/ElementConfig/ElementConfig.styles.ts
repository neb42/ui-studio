import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 16px;
  align-items: center;
  padding: 8px 16px;
  background-color: #1c1c1c;
`;

export const ComponentName = styled.span`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
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
  padding: 16px;
`;
