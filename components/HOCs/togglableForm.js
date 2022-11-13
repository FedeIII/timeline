import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import OutsideAlerter from './outsideAlerter';
import utilStyles from '../../styles/utils.module.scss';
import classNames from "classnames";

export default function TogglableForm(props) {
  const { children, onFormEdit, className } = props;

  const [isExitingEditMode, setExitingEditMode] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const submit = useCallback(handleSubmit(data => {
    setSubmitted(true);
    onFormEdit(data);
  }), [handleSubmit, setSubmitted, onFormEdit]);

  useEffect(() => {
    setEditMode(isExitingEditMode);
  }, [setEditMode, isExitingEditMode]);

  const onClickOutside = useCallback(() => {
    setExitingEditMode(false);
    submit();
  }, [setExitingEditMode]);

  const onFormClick = useCallback(() => setExitingEditMode(true), [setExitingEditMode]);

  useEffect(() => {
    if (submitted) {
      reset({});
      setSubmitted(false);
    }

  }, [reset, submitted, setSubmitted]);

  const topLevelStyles = classNames({
    [className]: true,
    [utilStyles.formHover]: !isExitingEditMode,
  });

  return (
    <OutsideAlerter onClickOutside={onClickOutside} enabled={isEditMode}>
      <form onClick={onFormClick}>
        {children({
          topLevelStyles,
          isEditMode,
          register,
        })}
      </form>
    </OutsideAlerter>
  );
}
