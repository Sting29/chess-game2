import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EditButtonLink } from "./styles";

function ButtonEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("#");
  };

  return (
    <EditButtonLink
      to="#"
      onClick={handleClick}
      aria-label={t("edit_button")}
    />
  );
}

export default ButtonEdit;
