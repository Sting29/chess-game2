import { AccountContainer, Title } from "./styles";
import BackButton from "src/components/BackButton/BackButton";

function Account() {
  return (
    <AccountContainer>
      <BackButton linkToPage="-1" />
      <Title>Account Settings</Title>
    </AccountContainer>
  );
}

export default Account;
