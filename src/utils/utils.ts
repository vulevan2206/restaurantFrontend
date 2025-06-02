/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, HttpStatusCode } from "axios";
import { toDataURL, QRCodeToDataURLOptions } from "qrcode";
import { nanoid } from "nanoid";

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntity<FormError>(
  error: unknown
): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  );
}

export function isAxiosUnauthorizedError<UnauthorizedError>(
  error: unknown
): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  );
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  date.setHours(date.getHours() + 7);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export const parseDate = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day + 1);
};

export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    console.log(JSON.parse(jsonPayload));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT format", e);
    return null;
  }
};

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(currency);
}

export function generateShortUUID(length = 5) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const options: QRCodeToDataURLOptions = {
  width: 400,
  margin: 2,
};

export const getQRCode = (value: string) => {
  let qrValue: string | undefined = undefined;

  toDataURL(value, options, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    qrValue = url;
  });

  return qrValue;
};

export const generateQRCode = (url: string) => {
  const qrValue = getQRCode(url);
  return qrValue;
};

export const generateTableToken = (length: number = 30) => {
  const uuid = nanoid(length);
  return uuid;
};
