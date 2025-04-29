import { useNavigate } from "react-router-dom";
import { BackButtonWrap } from "./styles";

function BackButton({ linkToPage }: { linkToPage: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkToPage === "-1") {
      navigate(-1); // Возврат на предыдущую страницу
    } else {
      navigate(linkToPage); // Навигация по конкретному пути
    }
  };
  return (
    <BackButtonWrap
      to={linkToPage}
      onClick={handleClick}
      aria-label="Back to previous page"
    />
  );
}

export default BackButton;
