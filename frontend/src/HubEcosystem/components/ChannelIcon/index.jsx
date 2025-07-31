import React from 'react';

import { Chat, Email, Facebook, Instagram, Telegram, WhatsApp } from '@material-ui/icons';

function ChannelIcon({ channel, ...rest }) {
  switch (channel) {
    case 'facebook':
      return <Facebook {...rest} />
    case 'instagram':
      return <Instagram {...rest} />
    case 'telegram':
      return <Telegram {...rest} />
    case 'email':
      return <Email {...rest} />
    case 'webchat':
      return <Chat {...rest} />
    default:
      return <WhatsApp {...rest} />
  }
}

export default ChannelIcon;
