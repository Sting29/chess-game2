import styled from "styled-components";
import { WidgetSize } from "./ChessTutorialButton";

export const ChessTutorialButtonWrap = styled.button<{
  $image: string;
  $widgetSize: WidgetSize;
}>(({ $image, $widgetSize }) => ({
  position: "relative",
  border: "none",
  background: `url(${$image})`,
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: $widgetSize === "large" ? "360px" : "280px",
  width: $widgetSize === "large" ? "360px" : "280px",
  transition: "transform 0.3s",

  "&:hover": {
    transform: "scale(1.05)",
  },
}));

export const LinkHeader = styled.h2<{ $widgetSize: WidgetSize }>(
  ({ $widgetSize }) => ({
    position: "absolute",
    bottom: $widgetSize === "large" ? "80px" : "60px",
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: "Wendy One",
    fontSize: $widgetSize === "large" ? "28px" : "38px",
    lineHeight: "40px",
    color: "#956721",
  })
);
