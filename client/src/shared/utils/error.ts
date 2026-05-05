export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    
    if (Array.isArray(errObj.errors) && errObj.errors.length > 0) {
      const firstError = errObj.errors[0] as Record<string, unknown>;
      if (typeof firstError.message === "string") {
        return firstError.message;
      }
    }
    
    const response = errObj.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    if (typeof data?.message === "string") {
      return data.message;
    }
    
    if (typeof errObj.message === "string") {
      return errObj.message;
    }
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred";
};
