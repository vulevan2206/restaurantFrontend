export type MomoPaymentParams = {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  amount: string;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  extraData?: string;
};