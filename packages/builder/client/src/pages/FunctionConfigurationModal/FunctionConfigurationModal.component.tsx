import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OpenAPIV3 } from 'openapi-types';
import { Event$TriggerAction, FunctionVariable, FunctionVariableArg } from '@ui-studio/types';
import { FunctionVariableArgConfig } from 'components/Variables/FunctionVariableArgConfig';

import * as Styles from './FunctionConfigurationModal.styles';

type Props = {
  schema: OpenAPIV3.OperationObject;
  config: FunctionVariable | Event$TriggerAction;
  onPathParamChange: (key: string, arg: FunctionVariableArg) => any;
  onQueryStringParamChange: (key: string, arg: FunctionVariableArg) => any;
  onBodyParamChange: (key: string, arg: FunctionVariableArg) => any;
};

export const FunctionConfigurationModalComponent = ({
  schema,
  config,
  onPathParamChange,
  onQueryStringParamChange,
  onBodyParamChange,
}: Props) => {
  if (!schema) throw new Error();

  const pathParamaters =
    schema.parameters?.filter(
      (p): p is OpenAPIV3.ParameterObject =>
        !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'path',
    ) ?? [];

  const queryParamaters =
    schema.parameters?.filter(
      (p): p is OpenAPIV3.ParameterObject =>
        !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'query',
    ) ?? [];

  const bodySchema = (() => {
    const rb = schema.requestBody;
    if (!rb) return null;
    if ('ref' in rb) throw new Error();
    const s = (rb as OpenAPIV3.RequestBodyObject).content['application/json'].schema;
    if (!s) return null;
    if ('ref' in s) throw new Error();
    return s as OpenAPIV3.SchemaObject;
  })();

  return (
    <Styles.Container>
      <Accordion
        disabled={pathParamaters.length === 0}
        defaultExpanded={pathParamaters.length > 0}
        disableGutters
        square
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Path parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pathParamaters.map((p) => (
            <FunctionVariableArgConfig
              key={p.name}
              name={p.name}
              schema={{ type: 'string' }}
              arg={config.args.path[p.name]}
              onChange={onPathParamChange}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={queryParamaters.length === 0}
        defaultExpanded={queryParamaters.length > 0}
        disableGutters
        square
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Query parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {queryParamaters.map((p) => (
            <FunctionVariableArgConfig
              key={p.name}
              name={p.name}
              schema={{ type: 'string' }}
              arg={config.args.query[p.name]}
              onChange={onQueryStringParamChange}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={bodySchema === null}
        defaultExpanded={bodySchema !== null}
        disableGutters
        square
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Body parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(bodySchema?.properties || {}).map((k) => {
            const s = bodySchema?.properties?.[k];
            if (!s || 'ref' in s) throw new Error();
            return (
              <FunctionVariableArgConfig
                key={k}
                name={k}
                schema={s as OpenAPIV3.SchemaObject}
                arg={config.args.body[k]}
                onChange={onBodyParamChange}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>
    </Styles.Container>
  );
};
