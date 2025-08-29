import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProgress } from "src/hooks/useProgress";
import {
  ProgressButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ProgressSection,
  CategoryTitle,
  ProgressItem,
  ProgressBar,
  ProgressText,
  NoProgressText,
  LoadingText,
  ErrorText,
} from "./styles";

const ShowProgressButton: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allProgress, loading, error, ensureFreshData } = useProgress();

  const handleShowProgress = async () => {
    await ensureFreshData();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getProgressByCategory = () => {
    const categories: Record<string, typeof allProgress> = {};

    allProgress.forEach((progress) => {
      if (!categories[progress.category]) {
        categories[progress.category] = [];
      }
      categories[progress.category].push(progress);
    });

    return categories;
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "how_to_move":
        return t("how_to_move");
      case "how_to_play":
        return t("how_to_play");
      case "mate-in-one":
        return t("mate_in_one");
      case "mate-in-two":
        return t("mate_in_two");
      case "basic-tactics":
        return t("basic_tactics");
      case "labyrinth":
        return t("labyrinth");
      default:
        return category;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case "tutorial":
        return t("tutorial");
      case "game":
        return t("game");
      default:
        return type;
    }
  };

  const renderProgressModal = () => {
    if (!isModalOpen) return null;

    const categorizedProgress = getProgressByCategory();

    return (
      <ModalOverlay onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{t("progress")}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          {loading && <LoadingText>{t("loading_progress")}</LoadingText>}

          {error && (
            <ErrorText>
              {t("error_loading_progress")}: {error}
            </ErrorText>
          )}

          {!loading &&
            !error &&
            Object.keys(categorizedProgress).length === 0 && (
              <NoProgressText>{t("no_progress_found")}</NoProgressText>
            )}

          {!loading &&
            !error &&
            Object.keys(categorizedProgress).length > 0 && (
              <>
                {Object.entries(categorizedProgress).map(
                  ([category, categoryProgress]) => (
                    <ProgressSection key={category}>
                      <CategoryTitle>
                        {getCategoryDisplayName(category)}
                      </CategoryTitle>

                      {categoryProgress.map((progressItem) => {
                        const completedCount = progressItem.completed.length;
                        const percentage = Math.min(completedCount * 10, 100);

                        return (
                          <ProgressItem key={progressItem.id}>
                            <ProgressText>
                              {getTypeDisplayName(progressItem.type)}:{" "}
                              {completedCount} {t("completed")}
                            </ProgressText>
                            <ProgressBar>
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #4CAF50, #8BC34A)",
                                  borderRadius: "inherit",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </ProgressBar>
                            <ProgressText>{percentage}%</ProgressText>
                          </ProgressItem>
                        );
                      })}
                    </ProgressSection>
                  )
                )}
              </>
            )}
        </ModalContent>
      </ModalOverlay>
    );
  };

  return (
    <>
      <ProgressButton onClick={handleShowProgress} disabled={loading}>
        {t("progress")}
      </ProgressButton>
      {renderProgressModal()}
    </>
  );
};

export default ShowProgressButton;
