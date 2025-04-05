import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";
import { ChessTutorialWrap, PalmLeaves, Clouds } from "./styles";

import Island0Img from "../../assets/images/island0.png";
import Island1Img from "../../assets/images/island1.png";
import Island2Img from "../../assets/images/island2.png";
import Island3Img from "../../assets/images/island3.png";
import IslandButton from "src/components/IslandButton/IslandButton";
import ParallaxElement from "src/components/ParallaxElement/ParallaxElement";
import PalmLeavesImg from "../../assets/images/palm.png";
import CloudImg from "../../assets/images/clouds.png";
import SeagullImg from "../../assets/images/seagull.png";

import { useIsMobile } from "src/hooks/useIsMobile";

const ChessTutorial = memo(function ChessTutorial() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Memoize islands array
  const islands = useMemo(
    () => [
      {
        name: "How to Move",
        image: Island0Img,
        position: { bottom: "25%", left: "30%" },
        mobilePosition: { bottom: "30%", left: "15%" },
        parallaxFactor: 3,
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/how-to-move"),
      },
      {
        name: "How to Play",
        image: Island1Img,
        position: { top: "28%", left: "20%" },
        mobilePosition: { top: "25%", left: "10%" },
        parallaxFactor: 2,
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/how-to-play"),
      },
      {
        name: "Chess Puzzles",
        image: Island2Img,
        position: { top: "28%", right: "40%" },
        mobilePosition: { top: "25%", right: "10%" },
        parallaxFactor: 1,
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/puzzles"),
      },
      {
        name: "Play with Computer",
        image: Island3Img,
        position: { bottom: "23%", right: "27%" },
        mobilePosition: { bottom: "30%", right: "15%" },
        parallaxFactor: 2,
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/play-with-computer"),
      },
      {
        name: "Play with Person",
        image: Island3Img,
        position: { top: "23%", right: "20%" },
        mobilePosition: { bottom: "30%", right: "15%" },
        parallaxFactor: 3,
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/play-with-person"),
      },
    ],
    [navigate]
  );

  // Memoize seagull position
  const seagullPosition = useMemo(
    () => ({
      top: "15%",
      left: "40%",
    }),
    []
  );

  return (
    <ChessTutorialWrap>
      <PalmLeaves $isMobile={isMobile}>
        <img src={PalmLeavesImg} alt="Palm Leaves" />
      </PalmLeaves>

      <Clouds $isMobile={isMobile}>
        <img src={CloudImg} alt="" />
      </Clouds>

      <ParallaxElement
        imageSrc={SeagullImg}
        position={seagullPosition}
        parallaxFactor={25}
        width="8%"
        mobileWidth="12%"
        zIndex={6}
      />

      {islands.map((island) => (
        <IslandButton
          key={island.name}
          imageSrc={island.image}
          position={island.position}
          mobilePosition={island.mobilePosition}
          parallaxFactor={island.parallaxFactor}
          width={island.width}
          mobileWidth={island.mobileWidth}
          onClick={island.onClick}
        />
      ))}
    </ChessTutorialWrap>
  );
});

export default ChessTutorial;
