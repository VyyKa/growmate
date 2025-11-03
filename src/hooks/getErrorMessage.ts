
import axios from "axios";
import type { ProblemDetails } from "../types/apiResponse/error";
import { firstFromErrors, coalesce } from "../utils/helpers/errorHelpers";
import { CORS, DEFAULT_ERROR_MSG, E400_MSG, E401_MSG, E403_MSG, E404_MSG, E422_MSG, E500_MSG, TIME_OUT } from "../utils/constants/errorMessage";

function handleStatusCode(status: number): string | undefined {
  switch (status) {
    case 400:
      return E400_MSG;
    case 401:
      return E401_MSG;
    case 403:
      return E403_MSG;
    case 404:
      return E404_MSG;
    case 422:
      return E422_MSG;
    default:
      if (status >= 500) return E500_MSG;
  }
  return undefined;
}

function handleAxiosError(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) 
    return fallback;

  // Timeout
  if (error.code === "ECONNABORTED" || /timeout/i.test(error.message || "")) {
    return TIME_OUT;
  }

  // No response means network / CORS / DNS
  if (!error.response) {
    return CORS;
  }
  
  const { status, data } = error.response as { 
    status: number; 
    data?: unknown 
  };

  if (typeof data === "string" && data.trim()) return data;
  const pd = (data || {}) as ProblemDetails;
  const modelError = firstFromErrors(pd.errors);
  const nestedErrorMsg = typeof pd.error === "string" ? pd.error : pd.error?.message;
  const msg = coalesce(
    pd.message,
    modelError,
    nestedErrorMsg,
    pd.detail,
    pd.title
  );
  if (msg) 
    return msg;
  const statusMsg = handleStatusCode(status);
  if (statusMsg) 
    return statusMsg;
  return fallback;
}


export function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MSG): string {
  if (axios.isAxiosError(error)) {
    return handleAxiosError(error, fallback);
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  try {
    const str = String(error);
    if (str && str !== "[object Object]") return str;
  } catch {
    // ignore stringify errors
  }
  return fallback;
}

export default getErrorMessage;