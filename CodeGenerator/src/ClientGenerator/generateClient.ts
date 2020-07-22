
interface Args {
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  widgets: Widget[];
  pages: Page[];
  layouts: Layout[];
}

const generateClient = ({
  queries,
  serverFunctions,
  clientFunctions,
  widgets,
  pages,
  layouts,
}: Args) => {

};

export default generateClient;