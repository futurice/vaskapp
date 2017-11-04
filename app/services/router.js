import React from 'react';

import Settings from '../containers/Settings';
import Conversations from '../containers/Conversations';

export const openComponent = (component, opts) => (navigator, params) => {
  const componentParams = Object.assign({}, { component }, opts, params);
  navigator.push(componentParams);
}

export const openSettings = openComponent(Settings, { showName: true, name: 'Settings' });
export const openConversations = openComponent(Conversations, { showName: true, name: 'Conversations' });