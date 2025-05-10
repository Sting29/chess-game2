import { useNavigate } from "react-router-dom";
import { BackButtonLink } from "./styles";
import { useTranslation } from "react-i18next";

function BackButton({ linkToPage }: { linkToPage: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkToPage === "-1") {
      navigate(-1); // Возврат на предыдущую страницу
    } else {
      navigate(linkToPage); // Навигация по конкретному пути
    }
  };
  return (
    <BackButtonLink
      to={linkToPage}
      onClick={handleClick}
      aria-label={t("back_button")}
    />
  );
}

export default BackButton;
