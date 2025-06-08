import React from "react";

type ImageProps = {
  alt?: string;
  src: string;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
};

const Image: React.FC<ImageProps> = ({ alt, src, height, width, style }) => (
  <img
    alt={alt}
    src={src}
    height={height}
    width={width ? width : height}
    style={style}
  />
);

export type { ImageProps };
export default Image;
