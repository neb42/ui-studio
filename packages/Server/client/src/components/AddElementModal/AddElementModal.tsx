import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Fade, Backdrop } from '@material-ui/core';
import { ChevronRightSharp, GridOnSharp, ViewWeekSharp, TextFieldsSharp } from '@material-ui/icons';
import { makeGetSelectedElement, getIsAddElementModalOpen } from 'selectors/element';
import { addWidget } from 'actions/widget';
import { addLayout } from 'actions/layout';
import { toggleAddElementModal } from 'actions/element';

import * as Styles from './AddElementModal.styles';

const categories = [
  { key: 'all', title: 'All', icon: ChevronRightSharp },
  { key: 'layout', title: 'Layout', icon: ChevronRightSharp },
  { key: 'controls', title: 'Controls', icon: ChevronRightSharp },
  { key: 'forms', title: 'Forms', icon: ChevronRightSharp },
  { key: 'typography', title: 'Typography', icon: ChevronRightSharp },
];

const elements: {
  [key: string]: {
    title: string;
    description: string;
    type: 'layout' | 'widget';
    subtype: string;
  }[];
} = {
  all: [],
  layout: [
    {
      title: 'Grid layout',
      description: 'fgff sgfsd gf gdfsgdfgs',
      type: 'layout',
      subtype: 'grid',
    },
    {
      title: 'Flex layout',
      description: 'fgff sgfsd gf gdfsgdfgs',
      type: 'layout',
      subtype: 'flex',
    },
    {
      title: 'Conditional render',
      description: 'Renders multiple children, each with their own condition to render',
      type: 'layout',
      subtype: 'conditional',
    },
  ],
  controls: [],
  forms: [],
  typography: [
    {
      title: 'Text',
      description: 'fgff sgfsd gf gdfsgdfgs',
      type: 'widget',
      subtype: 'text',
    },
  ],
};
elements.all = Object.values(elements).reduce((acc, cur) => [...acc, ...cur], []);

export const AddElementModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState('all');
  const selectedElement = useSelector(React.useMemo(makeGetSelectedElement, []));
  const isOpen = useSelector(getIsAddElementModalOpen);

  const handleClose = () => {
    setCategory('all');
    dispatch(toggleAddElementModal());
  };

  const handleAddElement = (type: 'layout' | 'widget', subtype: string) => () => {
    if (selectedElement) {
      if (type === 'layout') {
        if (subtype === 'grid') {
          dispatch(addLayout('grid', selectedElement.name));
          handleClose();
        }
        if (subtype === 'flex') {
          dispatch(addLayout('flex', selectedElement.name));
          handleClose();
        }
      }
      if (type === 'widget') {
        if (subtype === 'text') {
          dispatch(addWidget('text', selectedElement.name));
          handleClose();
        }
      }
    }
  };

  const handleClickCategory = (cat: string) => () => setCategory(cat);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={isOpen}>
        <Styles.Container>
          <Styles.Header>Add element</Styles.Header>
          <Styles.Categories>
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Styles.Category
                  key={c.key}
                  onClick={handleClickCategory(c.key)}
                  active={category === c.key}
                >
                  <Styles.CategoryTitle>{c.title}</Styles.CategoryTitle>
                  <Icon fontSize="default" />
                </Styles.Category>
              );
            })}
          </Styles.Categories>
          <Styles.ElementList>
            {(elements?.[category] ?? []).map((e) => (
              <Styles.Element key={e.title} onClick={handleAddElement(e.type, e.subtype)}>
                <Styles.ElementTitle>{e.title}</Styles.ElementTitle>
                <Styles.ElementDescription>{e.description}</Styles.ElementDescription>
              </Styles.Element>
            ))}
            <div />
          </Styles.ElementList>
        </Styles.Container>
      </Fade>
    </Modal>
  );
};
