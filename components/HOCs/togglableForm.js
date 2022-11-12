import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import OutsideAlerter from './outsideAlerter';

export default function TogglableForm(props) {
  const { children, onFormEdit } = props;

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

  return (
    <OutsideAlerter onClickOutside={onClickOutside} enabled={isEditMode}>
      <form onClick={onFormClick}>
        {children({
          isExitingEditMode,
          isEditMode,
          register,
        })}
      </form>
    </OutsideAlerter>
  );
}
