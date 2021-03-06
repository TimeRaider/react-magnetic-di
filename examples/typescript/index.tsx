import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DiProvider, di } from 'react-magnetic-di';

const useStateMock = di.mock(useState, () => useState(true));

const MyComponent = () => {
  di(useState);
  const [open, setOpen] = useState(false);
  return <button>{open ? 'open' : 'closed'}</button>;
};

/**
 * Main App
 */
const App = () => (
  <div>
    <h1>Usage examples</h1>
    <main>
      <MyComponent />
      <hr />
      <DiProvider use={[useStateMock]}>
        <MyComponent />
      </DiProvider>
    </main>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
