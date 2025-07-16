import AuthApis from "../apis/auth.apis";

const {
  loginApi,
  refreshTokenApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  resendForgotPasswordOtpApi,
  
} = AuthApis;

const AuthServices = {
  processLogin: async (payload) => {
    try {
      const response = await loginApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processLogin");
      }
    }
  },
  processLogout: async () => {
    try {
      const response = await logoutApi();
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processLogin");
      }
    }
  },
  processrRefreshToken: async () => {
    try {
      const response = await refreshTokenApi();
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processRefreshToken");
      }
    }
  },
  processForgotPassword: async (payload) => {
    try {
      const response = await forgotPasswordApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in forgotPasswordApi");
      }
    }
  },
  processResetPassword: async (payload) => {
    try {
      const response = await resetPasswordApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in resetPasswordApi");
      }
    }
  },

  processResendForgotOtp: async (payload) => {
    try {
      const response = await resendForgotPasswordOtpApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in resetPasswordApi");
      }
    }
  },
};

export default AuthServices;
