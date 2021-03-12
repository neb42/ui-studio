import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  overflow: hidden;
`;

export const ColLeft = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2),
    0 2px 6px rgba(16, 22, 26, 0.2);
`;
