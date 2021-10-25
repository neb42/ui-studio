import * as React from 'react';
import { PageBuilder } from 'pages/PageBuilder';
import { FunctionConfigurationModal } from 'pages/FunctionConfigurationModal';
import { Communicator } from 'pages/Communicator';

const App = (): JSX.Element => {
  return (
    <>
      <PageBuilder />
      <FunctionConfigurationModal />
      <Communicator />
    </>
  );
};

export default App;
