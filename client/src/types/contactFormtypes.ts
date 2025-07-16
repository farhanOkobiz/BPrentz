export interface ContactFormValues {
  firstName: string;
  subject: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactSubmitResponse {
  status: string;
  message: string;
}
