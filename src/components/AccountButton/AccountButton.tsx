import React from "react";
import { useTranslation } from "react-i18next";
import { StyledAccountButton } from "./styles";

interface AccountButtonProps {
  className?: string;
}

function AccountButton({ className }: AccountButtonProps) {
  const { t, i18n } = useTranslation();

  return (
    <StyledAccountButton
      to="/account"
      $isHebrew={i18n.language === "he"}
      className={className}
    >
      {t("layout_account_settings")}
    </StyledAccountButton>
  );
}

export default AccountButton;
