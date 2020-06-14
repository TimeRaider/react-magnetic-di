import { RuleTester } from 'eslint';
import rule from '../order';

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

var ruleTester = new RuleTester();
ruleTester.run('order', rule, {
  valid: [
    `
      import { useState } from 'react';
      import { di } from 'react-magnetic-di';

      function MyComponent() {
        di(useState);
        return useState(false);
      }
    `,
    `
      import { useState, useContext } from 'react';
      import { di } from 'react-magnetic-di';

      function MyComponent() {
        di(useState);
        // comment
        di(useContext);
        return useState(false);
      }
    `,
  ],

  invalid: [
    {
      code: `
        import { useState } from 'react';
        import { di } from 'react-magnetic-di';
  
        function MyComponent() {
          let result;
          di(useState);
          return useState(false);
        }
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          type: 'ExpressionStatement',
        },
      ],
    },
  ],
});