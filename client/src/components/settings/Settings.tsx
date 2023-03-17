import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SettingsPopup } from './SettingsPopup';
import { SettingsButton } from './SettingsButton';

export function Settings(): JSX.Element {
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const hideSettings = useCallback(() => {
    isSettingsVisible && setSettingsVisible(false);
  }, [isSettingsVisible]);

  useEffect(() => {
    let handler = () => {
      hideSettings();
    };

    document.addEventListener('click', handler);

    return () => {
      if (handler) {
        document.removeEventListener('click', handler);
      }
    }
  }, [hideSettings]);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    setSettingsVisible(!isSettingsVisible);
  };

  return (
    <>
      <SettingsButton
        isActive={isSettingsVisible}
        onClick={onClick}
      />

      <CSSTransition
        in={isSettingsVisible}
        timeout={200}
        classNames="fade"
        unmountOnExit
        mountOnEnter
      >
        <SettingsPopup isVisible={isSettingsVisible} />
      </CSSTransition>
    </>
  )
}