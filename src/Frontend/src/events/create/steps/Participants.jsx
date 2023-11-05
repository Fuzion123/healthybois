import { TextField } from "@mui/material";
import { userapi } from "_api";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { debounce } from "@mui/material/utils";
import { useMemo } from "react";
import { useField } from "formik";

export default function Participants(props) {
  const {
    formField: { participants },
  } = props;

  // little bit of a hack where I use a field and its validation from formik, but I dont render the field.
  const [field, meta, helpers] = useField(participants);
  const { setValue } = helpers;

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useMemo(
    () =>
      debounce((request, callback) => {
        searchUser(request, callback);
      }, 400),
    []
  );

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);

      return;
    }

    fetch({ input: inputValue }, (results) => {
      let newOptions = [];

      if (field.value.length > 0) {
        newOptions = field.value;
      }

      if (results.length > 0) {
        newOptions = [...newOptions, ...results];
      }

      setOptions(newOptions);
    });
  }, [field.value, inputValue, fetch]);

  async function searchUser(request, callback) {
    if (!request.input || request.input === null) return [];

    setLoading(true);
    let response = await userapi.searchUsers(request.input);
    setLoading(false);

    callback(response);
  }

  return (
    <div className="mb-8">
      <Autocomplete
        id="event-creation-participant-autocomplete"
        filterOptions={(x) => x}
        limitTags={3}
        multiple
        freeSolo={inputValue.length === 0 && loading === false}
        noOptionsText="No users found"
        loading={loading}
        loadingText="searching..."
        isOptionEqualToValue={(option, value) => option.userId === value.userId}
        getOptionLabel={(option) => option.userName || ""}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={field.value}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          if (newInputValue === null || newInputValue.length === 0) {
            setLoading(false);
          } else {
            setLoading(true);
          }

          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Event participants"
            fullWidth
            placeholder="enter name"
          />
        )}
        renderOption={(props, option) => (
          <Box {...props}>
            <div className="flex flex-row">
              <img
                loading="lazy"
                width="64"
                height="64"
                srcSet={option.profilePictureUri}
                src={option.profilePictureUri}
                alt=""
                className="shrink-0 rounded-full"
              />
              <div className="shrink-1 flex flex-col ml-3">
                <div>
                  <p className="h5">
                    {option.firstName} {option.lastName}
                  </p>
                </div>
                <div>aka {option.userName}</div>
              </div>
            </div>
          </Box>
        )}
      />
      <TextField hidden {...field} />
      <div>
        {meta.touched && meta.error && (
          <div>
            <p className="mui-validation-error">{meta.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
