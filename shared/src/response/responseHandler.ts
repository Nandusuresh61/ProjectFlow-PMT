type SuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
};

type ErrorResponse = {
  success: false;
  message: string;
};

export const ResponseHandler = {
  success<T>(
    message: string,
    data?: T
  ): SuccessResponse<T> {
    return {
      success: true,
      message,
      ...(data && { data }),
    };
  },

  error(
    message: string
  ): ErrorResponse {
    return {
      success: false,
      message,
    };
  },
};
