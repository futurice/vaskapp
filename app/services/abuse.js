import { Linking } from 'react-native';

const ABUSE_EMAIL_ADDRESS = '88c477b70c5d1a7d8d1a68bd2ec2402d@mail.flowdock.com';
const ABUSE_EMAIL_SUBJECT = 'Vask Flagged Content';


// item.type === 'IMAGE', item.url
function parseUrl(url) {
  return url;
//   const urlParts = url.split('/');
//   const imageId = urlParts[urlParts.length - 1];

//   return 'https://wappu.futurice.com/i/' + imageId;
}

// Reports feed item via email
function reportFeedItem(item) {

  if (!item.id) {
    throw new Error('No ID available for reported item!');
  }

  let emailURL = 'mailto:' + ABUSE_EMAIL_ADDRESS;

  // Subject (ID-hashtag to help searching from Flowdock inbox)
  emailURL += '?subject=' + ABUSE_EMAIL_SUBJECT + ' (ID' + item.id + ')';

  // Body
  emailURL += '&body=I want to report content with ID ' + item.id;
  if (item.url) {
    emailURL += ' \n\n ';
    emailURL += parseUrl(item.url);
  }
  emailURL += ' \n\n ';
  emailURL += '(Add voluntary explanation about content in here)';

  // Ship it
  Linking.openURL(emailURL);
}

export default {
  reportFeedItem
}
