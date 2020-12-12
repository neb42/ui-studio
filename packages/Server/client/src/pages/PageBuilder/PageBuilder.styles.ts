import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 25% 50% 25%;
  height: 100%;
`;

export const ColLeft = styled.div`
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2),
    0 2px 6px rgba(16, 22, 26, 0.2);
`;

export const ColRight = styled.div`
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2),
    0 2px 6px rgba(16, 22, 26, 0.2);
`;
