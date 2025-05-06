import styled from "styled-components";
import { Link } from "react-router-dom";
import buttonBack from "../../assets/elements/button_back.png";

export const BackButtonLink = styled(Link)`
  display: block;
  position: relative;
  height: 116px;
  width: 140px;
  border: none;
  background: url(${buttonBack}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
  }
`;

export const BackButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
`;
