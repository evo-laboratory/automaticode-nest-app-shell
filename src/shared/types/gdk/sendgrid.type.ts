export interface ISendGridSendMail {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html: string;
}

export interface ISendGridSendMailResItem {
  statusCode: number;
  body: string;
  headers: {
    server: string;
    date: string;
    'content-length': string;
    connection: string;
    'x-message-id': string;
    'access-control-allow-origin': string;
    'access-control-allow-methods': string;
    'access-control-allow-headers': string;
    'access-control-max-age': string;
    'x-no-cors-reason': string;
    'strict-transport-security': string;
  };
}
