import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { InputBase, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface ComponentsProp {
    setterValue: React.Dispatch<string>;
    placeholder: string
}

export default function InputSearch({ setterValue, placeholder = 'Cerca...' }: ComponentsProp) {
  const [debouncedInput, setDebouncedInput] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setterValue(debouncedInput);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [debouncedInput]);

  return (
    <TextField
      id="outlined-basic"
      placeholder={placeholder}
      variant="outlined"
      onInput={(value) => setDebouncedInput(value.target.value)}
      sx={{ width: '100%' }}
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
    />
  );
}