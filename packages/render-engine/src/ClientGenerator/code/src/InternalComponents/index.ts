import { parseComponents } from 'canvas-typescript';

import { Conditional } from './Conditional';
import { HTML } from './HTML';
import { Iterable } from './Iterable';
import { Layout } from './Layout';

const InternalComponents = parseComponents([Conditional, HTML, Iterable, Layout]);

export default InternalComponents;
