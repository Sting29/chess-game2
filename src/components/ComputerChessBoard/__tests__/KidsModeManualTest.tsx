import React from "react";
import { useTranslation } from "react-i18next";
import { ComputerChessBoard } from "../ComputerChessBoard";
import {
  GameEngineSettings,
  GameUISettings,
} from "../../../config/gameSettings";
import {
  TestContainer,
  TestTitle,
  TestSection,
  TestCaseTitle,
  TestCaseContainer,
  ExpectedBehaviorTitle,
  BehaviorList,
  BehaviorItem,
  ChessBoardContainer,
  InstructionsContainer,
  InstructionsTitle,
  InstructionsList,
  InstructionItem,
  InstructionSubList,
  InstructionSubItem,
  SuccessCriteriaTitle,
  SuccessCriteriaText,
  StrongText,
} from "./styles";

/**
 * Manual Test Component for Kids Mode Functionality
 *
 * This component demonstrates the kids mode functionality after the threat analysis button removal.
 *
 * Test Cases:
 * 1. Only hints toggle button should be displayed in kids mode
 * 2. Automatic threat highlighting should work when enabled
 * 3. Threat warning messages should appear correctly
 * 4. No buttons should appear in non-kids mode
 */

const KidsModeManualTest: React.FC = () => {
  const { t } = useTranslation();

  // Kids mode settings with threat highlighting enabled
  const kidsEngineSettings: GameEngineSettings = {
    skill: 0,
    depth: 1,
    time: 300,
    MultiPV: 3,
    threads: 1,
    kidsMode: true,
  };

  const kidsUISettings: GameUISettings = {
    showLastMoveArrow: true,
    showThreatHighlight: true,
    showMoveHints: true,
    enableSoundEffects: true,
  };

  // Non-kids mode settings
  const normalEngineSettings: GameEngineSettings = {
    ...kidsEngineSettings,
    kidsMode: false,
  };

  const normalUISettings: GameUISettings = {
    ...kidsUISettings,
    showThreatHighlight: false,
    showMoveHints: false,
  };

  return (
    <TestContainer>
      <TestTitle>{t("kids_mode_manual_test")}</TestTitle>

      <TestSection>
        <TestCaseTitle>{t("test_case_1_title")}</TestCaseTitle>
        <TestCaseContainer $borderColor="#4CAF50" $backgroundColor="#f9f9f9">
          <ExpectedBehaviorTitle>
            {t("expected_behavior")}
          </ExpectedBehaviorTitle>
          <BehaviorList>
            <BehaviorItem>✅ {t("test_case_1_behavior_1")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_1_behavior_2")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_1_behavior_3")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_1_behavior_4")}</BehaviorItem>
          </BehaviorList>

          <ChessBoardContainer>
            <ComputerChessBoard
              settings={kidsEngineSettings}
              uiSettings={kidsUISettings}
              onGameEnd={(result) =>
                console.log(t("kids_mode_game_ended"), result)
              }
            />
          </ChessBoardContainer>
        </TestCaseContainer>
      </TestSection>

      <TestSection>
        <TestCaseTitle>{t("test_case_2_title")}</TestCaseTitle>
        <TestCaseContainer $borderColor="#2196F3" $backgroundColor="#f0f8ff">
          <ExpectedBehaviorTitle>
            {t("expected_behavior")}
          </ExpectedBehaviorTitle>
          <BehaviorList>
            <BehaviorItem>✅ {t("test_case_2_behavior_1")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_2_behavior_2")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_2_behavior_3")}</BehaviorItem>
          </BehaviorList>

          <ChessBoardContainer>
            <ComputerChessBoard
              settings={normalEngineSettings}
              uiSettings={normalUISettings}
              onGameEnd={(result) =>
                console.log(t("normal_mode_game_ended"), result)
              }
            />
          </ChessBoardContainer>
        </TestCaseContainer>
      </TestSection>

      <TestSection>
        <TestCaseTitle>{t("test_case_3_title")}</TestCaseTitle>
        <TestCaseContainer $borderColor="#FF9800" $backgroundColor="#fff8e1">
          <ExpectedBehaviorTitle>
            {t("expected_behavior")}
          </ExpectedBehaviorTitle>
          <BehaviorList>
            <BehaviorItem>✅ {t("test_case_3_behavior_1")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_3_behavior_2")}</BehaviorItem>
            <BehaviorItem>✅ {t("test_case_3_behavior_3")}</BehaviorItem>
          </BehaviorList>

          <ChessBoardContainer>
            <ComputerChessBoard
              settings={kidsEngineSettings}
              uiSettings={{
                ...kidsUISettings,
                showThreatHighlight: false,
              }}
              onGameEnd={(result) =>
                console.log(t("kids_mode_no_threats_game_ended"), result)
              }
            />
          </ChessBoardContainer>
        </TestCaseContainer>
      </TestSection>

      <InstructionsContainer>
        <InstructionsTitle>
          {t("manual_testing_instructions")}
        </InstructionsTitle>
        <InstructionsList>
          <InstructionItem>
            <StrongText>{t("kids_mode_test")}</StrongText>
            <InstructionSubList>
              <InstructionSubItem>{t("instruction_1_1")}</InstructionSubItem>
              <InstructionSubItem>{t("instruction_1_2")}</InstructionSubItem>
              <InstructionSubItem>{t("instruction_1_3")}</InstructionSubItem>
              <InstructionSubItem>{t("instruction_1_4")}</InstructionSubItem>
            </InstructionSubList>
          </InstructionItem>
          <InstructionItem>
            <StrongText>{t("normal_mode_test")}</StrongText>
            <InstructionSubList>
              <InstructionSubItem>{t("instruction_2_1")}</InstructionSubItem>
              <InstructionSubItem>{t("instruction_2_2")}</InstructionSubItem>
            </InstructionSubList>
          </InstructionItem>
          <InstructionItem>
            <StrongText>{t("kids_mode_no_threats_test")}</StrongText>
            <InstructionSubList>
              <InstructionSubItem>{t("instruction_3_1")}</InstructionSubItem>
            </InstructionSubList>
          </InstructionItem>
        </InstructionsList>

        <SuccessCriteriaTitle>{t("success_criteria")}</SuccessCriteriaTitle>
        <SuccessCriteriaText>✅ {t("success_criteria_1")}</SuccessCriteriaText>
        <SuccessCriteriaText>✅ {t("success_criteria_2")}</SuccessCriteriaText>
        <SuccessCriteriaText>✅ {t("success_criteria_3")}</SuccessCriteriaText>
      </InstructionsContainer>
    </TestContainer>
  );
};

export default KidsModeManualTest;
