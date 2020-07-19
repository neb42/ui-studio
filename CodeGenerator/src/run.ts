import generateServer from './ServerGenerator/generateServer';
import generateClient from './ClientGenerator/generateClient';

const run = () => {
  const nodes = [];

  const datasets = nodes.filter(o => o.type === 'dataset');
  const queries = nodes.filter(o => o.type === 'query');
  const serverFunctions = nodes.filter(o => o.type === 'serverFunction');
  const clientFunctions = nodes.filter(o => o.type === 'clientFunction');
  const pages = nodes.filter(o => o.type === 'pages');
  const layouts = nodes.filter(o => o.type === 'layout');
  const components = nodes.filter(o => o.type === 'component');

  generateServer({
    datasets,
    queries,
    serverFunctions,
    clientFunctions,
    components,
  });
  generateClient();
};