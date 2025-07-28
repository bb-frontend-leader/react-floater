import { cloneElement, CSSProperties, isValidElement, memo, ReactNode, Ref, useMemo } from 'react';
import { PlainObject } from '@gilbarbara/types';

import { STATUS } from '../../literals';
import { CloseFunction, FloaterComponent, Statuses, Styles } from '../../types';

import Arrow from './Arrow';
import Container from './Container';

interface Props {
  arrow?: ReactNode;
  arrowRef: Ref<HTMLSpanElement>;
  component?: FloaterComponent;
  content?: ReactNode;
  floaterRef: Ref<HTMLDivElement>;
  footer?: ReactNode;
  hideArrow: boolean;
  id: string;
  onClick: CloseFunction;
  placement: string;
  positionWrapper: boolean;
  showCloseButton?: boolean;
  status: Statuses;
  styles: Styles;
  title?: ReactNode;
}

function Floater(props: Props) {
  const {
    component,
    content,
    floaterRef,
    hideArrow,
    id,
    onClick: closeFn,
    placement,
    status,
    styles,
  } = props;

  const style = useMemo(() => {
    const {
      arrow: { length },
      floater,
      floaterCentered,
      floaterClosing,
      floaterOpening,
      floaterWithComponent,
    } = styles;
    let element: CSSProperties = { ...floater };

    if (!hideArrow) {
      if (placement.startsWith('top')) {
        element.padding = `0 0 ${length}px`;
      } else if (placement.startsWith('bottom')) {
        element.padding = `${length}px 0 0`;
      } else if (placement.startsWith('left')) {
        element.padding = `0 ${length}px 0 0`;
      } else if (placement.startsWith('right')) {
        element.padding = `0 0 0 ${length}px`;
      }
    }

    if (status === STATUS.CLOSING) {
      element = { ...element, ...floaterClosing };
    }

    if (status === STATUS.OPENING || status === STATUS.OPEN) {
      element = { ...element, ...floaterOpening };
    }

    if (placement === 'center') {
      element = { ...element, ...floaterCentered };
    }

    if (component) {
      element = { ...element, ...floaterWithComponent };
    }

    return element;
  }, [component, hideArrow, placement, status, styles]);

  const shouldRender = ['closing', 'open', 'opening', 'render'].includes(status);

  const output: PlainObject<ReactNode> = {};
  const classes = ['__floater'];
  const baseProps = { role: 'tooltip' };

  if (component) {
    const componentProps = { closeFn, id, ...baseProps };

    output.content = isValidElement(component)
      ? cloneElement(component, componentProps)
      : component(componentProps);
  } else {
    output.content = <Container {...props} content={content} />;
  }

  if (status === STATUS.OPEN) {
    classes.push('__floater__open');
  }

  if (!hideArrow) {
    output.arrow = <Arrow {...props} />;
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <div ref={floaterRef} id={id} style={{ zIndex: styles.options.zIndex }}>
      <div className={classes.join(' ')} style={style} {...baseProps}>
        <div className="__floater__body">
          {output.content}
          {output.arrow}
        </div>
      </div>
    </div>
  );
}

export default memo(Floater);
