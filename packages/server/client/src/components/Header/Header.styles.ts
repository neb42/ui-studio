import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 55px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.secondary900};
  background-color: ${({ theme }) => theme.colors.background.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary300};

  & img {
    margin-right: 16px;
  }
`;
