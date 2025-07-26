import { useNavigate } from "react-router-dom";
import { memo, useMemo, useState } from "react";
import { ChessTutorialWrap, PalmLeaves, Clouds, TextBlock } from "./styles";

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
import { useTranslation } from "react-i18next";

const ChessTutorial = memo(function ChessTutorial() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentTextKey, setCurrentTextKey] = useState("chess_map");

  // Memoize islands array
  const islands = useMemo(
    () => [
      {
        id: "how_to_play",
        image: Island1Img,
        // nameKey: "how_to_move",
        // image: Island0Img,
        position: { bottom: "25%", left: "30%" },
        mobilePosition: { bottom: "30%", left: "15%" },
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/how-to-play"),
        // onClick: () => navigate("/how-to-move"),
        animationType: "default" as const,
      },
      {
        id: "how_to_move",
        image: Island0Img,
        // nameKey: "how_to_play",
        // image: Island1Img,
        position: { top: "28%", left: "20%" },
        mobilePosition: { top: "25%", left: "10%" },
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/how-to-move"),
        // onClick: () => navigate("/how-to-play"),
        animationType: "gentle" as const,
      },
      {
        id: "chess_puzzles",
        image: Island2Img,
        position: { top: "28%", right: "40%" },
        mobilePosition: { top: "25%", right: "10%" },
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/puzzles"),
        animationType: "swing" as const,
      },
      {
        id: "play_chess",
        image: Island3Img,
        position: { bottom: "23%", right: "27%" },
        mobilePosition: { bottom: "30%", right: "15%" },
        width: "15%",
        mobileWidth: "22%",
        onClick: () => navigate("/play"),
        animationType: "bounce" as const,
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
        <img src={PalmLeavesImg} alt={t("palm_leaves_alt")} />
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
          key={island.id}
          imageSrc={island.image}
          position={island.position}
          mobilePosition={island.mobilePosition}
          width={island.width}
          mobileWidth={island.mobileWidth}
          onClick={island.onClick}
          animationType={island.animationType}
          onMouseEnter={() => setCurrentTextKey(island.id)}
          onFocus={() => setCurrentTextKey(island.id)}
          onMouseLeave={() => setCurrentTextKey("chess_map")}
        />
      ))}

      <TextBlock $isMobile={isMobile}>{t(currentTextKey)}</TextBlock>
    </ChessTutorialWrap>
  );
});

export default ChessTutorial;
