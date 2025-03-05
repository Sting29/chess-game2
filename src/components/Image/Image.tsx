import React from 'react';

type ImageProps = {
  alt?: string;
  src: string;
  height?: number;
  width?: number;
};

const Image: React.FC<ImageProps> = ({ alt, src, height, width }) => (
  <img alt={alt} src={src} height={height} width={width ? width : height} />
);

export type { ImageProps };
export default Image;
