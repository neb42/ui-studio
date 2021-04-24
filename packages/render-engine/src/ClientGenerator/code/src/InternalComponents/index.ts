import { parseComponents } from '@ui-studio/typescript';

import { Conditional } from './Conditional';
import { HTML } from './HTML';
import { Iterable } from './Iterable';
import { Layout } from './Layout';
import { Text } from './Text';

const InternalComponents = parseComponents([Conditional, HTML, Iterable, Layout, Text]);

export default InternalComponents;
