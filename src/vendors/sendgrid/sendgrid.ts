// * GDK Application Shell Default File
import * as SendGrid from '@sendgrid/mail';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const SendGridSDK = SendGrid;
export default SendGridSDK;
