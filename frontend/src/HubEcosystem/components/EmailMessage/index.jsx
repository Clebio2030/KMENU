import React from 'react';

import ReactHtmlParser from 'react-html-parser';

function transform(node, index) {
  const { type, parent, next } = node;
  if (type === 'text' && parent === null && index === 0 && next !== null) {
    return null;
  }
}

function EmailMessage({ message }) {
  return (
    <>{ReactHtmlParser(message, { transform })}</>
  )
}

export default EmailMessage;
