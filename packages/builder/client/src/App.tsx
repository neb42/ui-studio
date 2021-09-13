import React from 'react';
import { PageBuilder } from 'pages/PageBuilder';
import { FunctionConfigurationModal } from 'pages/FunctionConfigurationModal';

const App = (): JSX.Element => {
  return (
    <>
      <PageBuilder />
      <FunctionConfigurationModal />
    </>
  );
};

export default App;
