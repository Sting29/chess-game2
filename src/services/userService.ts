import httpClient from "./httpClient";
import errorHandler from "./errorHandler";
import { User, UpdateProfileRequest, UserSession, ChessSet } from "./types";
import { AxiosError } from "axios";

class UserService {
  // Get current user profile
  public async getProfile(): Promise<User> {
    try {
      const response = await httpClient.get<User>("/user/profile");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "get-profile");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update user profile
  public async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    try {
      const response = await httpClient.patch<User>(
        "/user/profile",
        profileData
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-profile");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update language preference
  public async updateLanguage(
    language: "he" | "en" | "ar" | "ru"
  ): Promise<User> {
    try {
      const profileData: UpdateProfileRequest = {
        profile: {
          language,
        },
      };

      return await this.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-language");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update chess set preference
  public async updateChessSet(chessSet: ChessSet): Promise<User> {
    try {
      const profileData: UpdateProfileRequest = {
        profile: {
          chessSet,
        },
      };

      return await this.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-chess-set");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update avatar settings
  public async updateAvatar(avatarData: {
    avatar?: "avatar1" | "avatar2" | "avatar3";
    avatarHat?: "avatarHat1" | "avatarHat2";
    avatarWear?: "avatarWear1" | "avatarWear2" | "avatarWear3";
  }): Promise<User> {
    try {
      const profileData: UpdateProfileRequest = {
        profile: avatarData,
      };

      return await this.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-avatar");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update basic user information
  public async updateBasicInfo(userData: {
    email?: string;
    username?: string;
    name?: string;
  }): Promise<User> {
    try {
      const profileData: UpdateProfileRequest = userData;

      return await this.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-basic-info");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Update personal information
  public async updatePersonalInfo(personalData: {
    age?: number;
    gender?: "male" | "female" | "other" | "prefer_not_to_say";
  }): Promise<User> {
    try {
      const profileData: UpdateProfileRequest = {
        profile: personalData,
      };

      return await this.updateProfile(profileData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "update-personal-info");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Get user sessions
  public async getSessions(): Promise<UserSession[]> {
    try {
      const response = await httpClient.get<UserSession[]>("/user/sessions");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "get-sessions");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Revoke specific session
  public async revokeSession(sessionId: string): Promise<void> {
    try {
      await httpClient.delete(`/user/sessions/${sessionId}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "revoke-session");

      // Re-throw with processed error
      throw apiError;
    }
  }

  // Revoke all sessions except current
  public async revokeAllSessions(): Promise<void> {
    try {
      await httpClient.delete("/user/sessions");
    } catch (error) {
      const axiosError = error as AxiosError;
      const apiError = errorHandler.processError(axiosError);

      // Log the error
      errorHandler.logError(axiosError, "revoke-all-sessions");

      // Re-throw with processed error
      throw apiError;
    }
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;
