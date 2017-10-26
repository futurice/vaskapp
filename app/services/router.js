import React from 'react';

import Settings from '../containers/Settings';

export const openComponent = (component, opts) => (navigator, params) => {
  const componentParams = Object.assign({}, { component }, opts, params);
  navigator.push(componentParams);
}

export const openSettings = openComponent(Settings, { showName: true, name: 'Settings' });