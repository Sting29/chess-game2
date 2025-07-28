import styled from "styled-components";
import { Link } from "react-router-dom";
import buttonYellow from "src/assets/elements/button_yellow.png";

export const StyledAccountButton = styled(Link)<{
  $isHebrew: boolean;
  $avatarSrc: string;
}>`
  display: block;
  position: relative;
  height: 56px;
  width: 200px;
  margin-right: 28px;
  border: none;
  background: url(${buttonYellow}) no-repeat center center;
  background-size: contain;
  transition: transform 0.2s;
  text-decoration: none;

  padding-top: 10px;
  font-family: "RubikOne", sans-serif;
  font-size: 32px;
  line-height: 100%;
  color: #fff7db;
  text-align: center;
  -webkit-text-stroke: 1px black;

  &::before {
    content: "";
    position: absolute;
    left: ${({ $isHebrew }) => ($isHebrew ? "-40px" : "-56px")};
    top: 50%;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
    background: url(${({ $avatarSrc }) => $avatarSrc}) no-repeat center;
    background-size: contain;
  }

  &:hover {
    transform: scale(1.05);
  }
`;
