import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://futurice.github.io/vaskapp';

const terms = [
  {title: 'Terms of Service', icon: 'info-outline', component: TermsView},
  {title: 'Privacy', link: `${ROOT_URL}/privacy.html`, icon: 'lock-outline', showInWebview: true},
  {title: 'Licenses', link: `${ROOT_URL}/licenses.html`, icon: 'copyright', showInWebview: true},
];

const support = [
  {title: 'Feedback', mailto: 'vaskapp@futurice.com', icon: 'mail-outline'},
  {title: 'Read the source', link: 'https://github.com/futurice/vaskapp', icon: 'code', showInWebview: true},
  // TODO Add IOS & Android rate links in next version
  // {title: 'Rate the app', link: 'https://itunes.apple.com/fi/app/futubohemia/id1242923584?mt=8', icon: 'thumb-up'},
];

export {
  terms,
  support,
};
