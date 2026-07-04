/** Single source of truth for the manual bank-transfer account details. */
export const BANK_INFO = {
  bank: "ธนาคารกสิกรไทย",
  accountNumber: "134-3-11564-0",
  /** Digits only — what gets copied to the clipboard. */
  accountNumberRaw: "1343115640",
  accountName: "บริษัท โรจน์รุ่งธุรกิจ จำกัด",
} as const;
