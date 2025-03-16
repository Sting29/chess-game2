import { useNavigate } from "react-router-dom";
import { BackButtonWrap } from "./styles";

function BackButton({ linkToPage }: { linkToPage: string }) {
  const navigate = useNavigate();

  return (
    <BackButtonWrap
      className="back-button"
      onClick={() => navigate(linkToPage)}
    >
      Back to previous page
    </BackButtonWrap>
  );
}

export default BackButton;
