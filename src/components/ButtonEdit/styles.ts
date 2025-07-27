import styled from "styled-components";
import { Link } from "react-router-dom";
import buttonEdit from "../../assets/elements/button_edit.svg";

export const EditButtonLink = styled(Link)`
  display: block;
  position: relative;
  height: 116px;
  width: 140px;
  border: none;
  background: url(${buttonEdit}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
  }
`;

export const EditButtonWrap = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
`;
