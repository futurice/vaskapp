import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';
import BlogList from '../components/blog/BlogList';

const ROOT_URL = 'https://futurice.github.io/prahapp-site';

const links = [
  // { title: 'Your pix', icon: 'photo-library', component: UserView, subtitle: 'All your photos' },
  { title: 'Blog', subtitle: 'Discover latest articles', component: BlogList, icon: 'comment', showInWebview: true },
  { title: 'Hours', subtitle: 'Hours in, Invoices out', link: 'https://hours.app.futurice.com/', icon: 'timelapse', showInWebview: true },
  { title: 'Learning', subtitle: 'Explore, Evolve, Stay curious', link: 'https://learning.app.futurice.com/', icon: 'import-contacts', showInWebview: true },
];

const terms = [
  {title: 'Terms of Service', link: `${ROOT_URL}/terms.html`, icon: 'info-outline', component: TermsView, showInWebview: false},
  {title: 'Privacy', link: `${ROOT_URL}/privacy.html`, icon: 'lock-outline', showInWebview: true},
  {title: 'Licenses', link: `${ROOT_URL}/licences.html`, icon: 'help-outline', showInWebview: true},
];


// TODO Adroid link here to rate link
const support = [
  {title: 'Feedback', mailto: 'futubohemia@futurice.com', icon: 'mail-outline'},
  {title: 'Read the source', link: 'https://github.com/futurice/vaskapp', icon: 'code', showInWebview: true},
  {title: 'Rate the app', link: 'https://itunes.apple.com/fi/app/futubohemia/id1242923584?mt=8', icon: 'thumb-up'},
];

const general = [
  {title: 'Edit profile', link: 'https://github.com/futurice/vaskapp', icon: 'create'},
  {title: 'Edit notifications', link: 'https://github.com/futurice/vaskapp', icon: 'notifications'},
];


export {
  links,
  terms,
  support,
  general,
};
