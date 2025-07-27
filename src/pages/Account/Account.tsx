import { BackButtonWrap } from "src/components/BackButtonImage/styles";
import { PageContainer } from "./styles";
import { useTranslation } from "react-i18next";
import { PageTitle } from "src/components/PageTitle/PageTitle";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";

function Account() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageTitle title={t("account_settings")} />
      <BackButtonWrap>
        <BackButtonImage linkToPage="-1" />
      </BackButtonWrap>
    </PageContainer>
  );
}

export default Account;
