import { Widget, Layout, TStyle } from 'canvas-types';

export class ElementModel {
  // UPDATE_ELEMENT_POSITION
  static updateElementPosition = <T extends Widget | Layout>(
    element: T,
    movingElementId: string,
    source: {
      parentId: string;
      position: number;
    },
    destination: {
      parentId: string;
      position: number;
    },
    style: TStyle,
  ): T => {
    // The element being moved
    if (element.id === movingElementId) {
      return {
        ...element,
        parent: destination.parentId,
        position: destination.position,
        style,
      };
    }
    // The element is being moved within it's current parent element
    if (destination.parentId === source.parentId) {
      if (element.parent === destination.parentId) {
        const position = (() => {
          let p = element.position;
          if (p > source.position) p -= 1;
          if (p >= destination.position) p += 1;
          return p;
        })();
        return {
          ...element,
          position,
        };
      }
    }
    // The element has been moved into this element's parent
    if (element.parent === destination.parentId) {
      return {
        ...element,
        position:
          element.position >= destination.position ? element.position + 1 : element.position,
      };
    }
    // The element has been moved out of this element's parent
    if (element.parent === source.parentId) {
      return {
        ...element,
        position: element.position > source.position ? element.position - 1 : element.position,
      };
    }
    return element;
  };
}
