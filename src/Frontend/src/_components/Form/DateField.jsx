import React, { useState, useEffect } from "react";
import { useField } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export default function DatePickerField(props) {
  const [field, meta, helper] = useField(props);
  const { touched, error } = meta;
  const { setValue } = helper;
  const isError = touched && error && true;
  const { value } = field;
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      dayjs(date);
      setSelectedDate(dayjs(date));
    }
  }, [value]);

  function _onChange(date) {
    if (date) {
      setSelectedDate(date);
      try {
        setValue(date);
      } catch (error) {
        setValue(date);
      }
    } else {
      setValue(date);
    }
  }

  return (
    <div>
      <DateTimePicker
        {...field}
        {...props}
        sx={{ width: "100% " }}
        value={selectedDate}
        onChange={_onChange}
        error={error}
        invalidDateMessage={isError && error}
        slotProps={{
          textField: {
            error: !!error,
            helperText: error,
          },
        }}
      />
      {/* {isError && <div>{error}</div>} */}
    </div>
  );
}
