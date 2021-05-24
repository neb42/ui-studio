import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Header = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;
