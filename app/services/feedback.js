import { Linking } from 'react-native';

const FEEDBACK_EMAIL_ADDRESS = 'vaskapp@futurice.com';
const FEEDBACK_EMAIL_SUBJECT = 'Vask feedback';



function formatMailtoUrl(url = FEEDBACK_EMAIL_ADDRESS, subject = FEEDBACK_EMAIL_SUBJECT) {
  const mailtoUrl = url || FEEDBACK_EMAIL_ADDRESS;
  let feedbackUrl = 'mailto:' + mailtoUrl;
  // Subject (ID-hashtag to help searching from Flowdock inbox)
  feedbackUrl += '?subject=' + subject;
  // Body
  feedbackUrl += '&body=';

  return feedbackUrl;
}


// Send feedback via email
function sendEmail(url, subject) {

  const emailURL = formatMailtoUrl(url, subject);

  // Ship it
  Linking.openURL(emailURL);
}

export default {
  sendEmail,
}
