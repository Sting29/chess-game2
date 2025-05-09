import { AccountContainer, Title } from "./styles";
import BackButton from "src/components/BackButton/BackButton";

function SettingsPage() {
  return (
    <AccountContainer>
      <BackButton linkToPage="-1" />
      <Title>Settings</Title>
    </AccountContainer>
  );
}

export default SettingsPage;
