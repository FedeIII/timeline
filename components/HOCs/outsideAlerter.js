import React, { useRef, useEffect } from 'react';

function useOutsideAlerter(ref, onClickOutside, enabled) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && enabled) {
        onClickOutside();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside, enabled]);
}

function OutsideAlerter(props) {
  const { onClickOutside, enabled, children, ...restProps } = props;

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onClickOutside, enabled);

  return (
    <div ref={wrapperRef} {...restProps}>
      {children}
    </div>
  );
}

export default OutsideAlerter;
