export type ProjectInquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  website: string;
  role: string;
  companySize: string;
  businessRevenue: string;
  project: string;
  source: "Website";
};

export type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: string;
    };

export type Env = {
  ALLOWED_ORIGINS: string;
  NOTION_PROJECT_INQUIRIES_DATA_SOURCE_ID: string;
  NOTION_TOKEN: string;
};
