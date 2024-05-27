import React from 'react';

async function loadRemoteComponent(url: string) {
  //   const script = `(function (global, factory) {
  //       typeof exports === 'object' && typeof module !== 'undefined'
  //         ? (module.exports = factory(require('react')))
  //         : typeof define === 'function' && define.amd
  //         ? define(['react'], factory)
  //         : ((global =
  //             typeof globalThis !== 'undefined' ? globalThis : global || self),
  //           (global.test = factory(global.react)));
  //     })(this, function (react) {
  //       function RemoteComponent() {
  //         return react.createElement('div', null, 'RemoteComponent');
  //       }

  //       return RemoteComponent;
  //     })`;
  const script = await fetch(url).then((res) => res.text());
  const module = { exports: {} };
  const exports = {};
  const require = (id) => {
    if (id === 'react') return React;
  };
  const func = new Function('module', 'exports', 'require', script);
  func(module, exports, require);
  console.dir(module.exports);
  return { default: module.exports } as any;
}
export default loadRemoteComponent;
