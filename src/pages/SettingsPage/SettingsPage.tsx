import { PageTitle } from "src/components/PageTitle/PageTitle";
import { PageContainer } from "./styles";
import BackButtonImage from "src/components/BackButtonImage/BackButtonImage";
import { BackButtonWrap } from "src/components/BackButtonImage/styles";

function SettingsPage() {
  return (
    <PageContainer>
      <PageTitle title="Settings" />
      <BackButtonWrap>
        <BackButtonImage linkToPage="-1" />
      </BackButtonWrap>
    </PageContainer>
  );
}

export default SettingsPage;
