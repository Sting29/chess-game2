import { AccountContainer, Title } from "./styles";
import BackButton from "src/components/BackButton/BackButton";
import { useTranslation } from "react-i18next";

function Account() {
  const { t } = useTranslation();
  return (
    <AccountContainer>
      <BackButton linkToPage="-1" />
      <Title>{t("account_settings")}</Title>
    </AccountContainer>
  );
}

export default Account;
