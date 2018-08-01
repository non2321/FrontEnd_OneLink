import React from 'react';
import HtmlRender from '../../components/utils/HtmlRender'

export default {
  childRoutes: [
    {
      path: '*',
      getComponent(nextState, cb){
        System.import('./containers/NotFound').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]
};
