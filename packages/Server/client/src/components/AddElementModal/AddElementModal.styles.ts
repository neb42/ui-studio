import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  width: 600px;
  height: 400px;
  background-color: #fff;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: min-content 1fr;
  outline: none;
`;

export const Header = styled.div`
  grid-column: span 2;
  grid-row: 1;
  background-color: #000;
  color: #fff;
  padding: 16px;
`;

export const Categories = styled.div`
  padding: 8px 0;
  border-right: 1px solid #000;
  overflow: auto;
`;

interface ICategory {
  active: boolean;
  theme: {
    colors: {
      [key: string]: string;
    };
  };
}

export const Category = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  align-items: center;
  margin: 8px;
  padding-left: 8px;
  cursor: pointer;
  transition: background-color 600ms;

  background-color: ${({ theme, active }: ICategory) =>
    active ? Color(theme.colors.brand300).alpha(0.4).hsl().string() : '#fff'};

  &:hover {
    background-color: ${({ theme }: ICategory) =>
      Color(theme.colors.brand300).alpha(0.4).hsl().string()};
  }
`;

export const CategoryTitle = styled.span``;

export const ElementList = styled.div``;

interface IElement {
  theme: {
    colors: {
      [key: string]: string;
    };
  };
}

export const Element = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 8px;
  border-bottom: 1px solid #000;
  padding: 16px;
  cursor: pointer;
  transition: background-color 600ms;
  overflow: auto;

  &:hover {
    background-color: ${({ theme }: IElement) =>
      Color(theme.colors.brand300).alpha(0.4).hsl().string()};
  }
`;

export const ElementTitle = styled.span``;

export const ElementDescription = styled.span``;
