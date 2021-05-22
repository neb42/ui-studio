import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 16px;
  height: 55px;
  background-color: ${({ theme }) => theme.colors.background.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary300};

  & > *:nth-child(2) {
    justify-self: center;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  height: 55px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};

  & img {
    margin-right: 16px;
  }
`;
