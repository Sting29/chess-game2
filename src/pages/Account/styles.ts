import styled from "styled-components";
import backgroundCheckLesson from "../../assets/background/background_account.png";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 96px);
  padding: 0 40px;
  background-image: url(${backgroundCheckLesson});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export const Title = styled.h1`
  font-family: "RubikOne", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 50px;
  color: #3e302a;
  margin: 60px 0 40px;
  text-align: center;
`;

export const AccountSettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  width: 900px;
  margin-top: 20px;
`;

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const SettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
`;

export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-family: "RubikOne", sans-serif;
  font-size: 18px;
  color: #3e302a;
  text-align: center;
`;

export const StyledInput = styled.input`
  padding: 12px 20px;
  border-radius: 25px;
  border: 3px solid #f0d070;
  background: rgba(255, 255, 255, 0.9);
  font-family: "WendyOne", sans-serif;
  font-size: 16px;
  text-align: center;
  color: #3e302a;

  &:focus {
    outline: none;
    border-color: #e6c04a;
    background: rgba(255, 255, 255, 1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const LevelSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 12px 20px;
  border-radius: 25px;
  background: linear-gradient(135deg, #f0d070 0%, #e6c04a 100%);
  color: #3e302a;
  font-family: "RubikOne", sans-serif;
  font-size: 18px;
  border: 3px solid #d4af37;
`;

export const TrophyIcon = styled.div`
  width: 30px;
  height: 30px;
  background: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &::before {
    content: "🏆";
  }
`;
