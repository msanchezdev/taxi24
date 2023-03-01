// OTP Purpose
export const OtpPurpose = {
  USER_REGISTRATION: 'user-registration',
} as const;

export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];
export const OtpPurposes = Object.values(OtpPurpose) as [
  OtpPurpose,
  ...OtpPurpose[],
];

// Delivery Methods
export const OtpDeliveryMethod = {
  EMAIL: 'email',
} as const;

export type OtpDeliveryMethod =
  (typeof OtpDeliveryMethod)[keyof typeof OtpDeliveryMethod];

export const OtpDeliveryMethods = Object.values(OtpDeliveryMethod) as [
  OtpDeliveryMethod,
  ...OtpDeliveryMethod[],
];
