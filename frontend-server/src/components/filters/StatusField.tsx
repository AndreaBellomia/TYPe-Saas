import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

import CheckIcon from '@mui/icons-material/Check';


interface ComponentProps {
    state: [string, React.Dispatch<React.SetStateAction<string>>]
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  {
    label: 'Backlog',
    key: 'backlog',
  },
  {
    label: 'Da fare',
    key: 'todo',
  },
  {
    label: 'In lavorazione',
    key: 'progress',
  },
  {
    label: 'Bloccato',
    key: 'blocked',
  },
  {
    label: 'Completo',
    key: 'done',
  },
];

function getRenderValue(selected) {
  return selected.map((key) => names.find((obj) => obj.key === key).label).join(', ');
}

export default function _({ state }: ComponentProps) {
  const [value, setValue] = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    
    setValue(value.join(','));
  };

  const getValues = () => {
    return value ? value.split(',') : [];
  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <Select
          multiple
          value={getValues()}
          onChange={handleChange}
          input={<OutlinedInput placeholder="cioa" />}
          renderValue={getRenderValue}
          MenuProps={MenuProps}
        >
          {names.map((onj) => (
            <MenuItem key={onj.key} value={onj.key}>
              {getValues().includes(onj.key) ? <CheckIcon fontSize="10" sx={{ mr: 2 }} /> : <Box sx={{ width: 32 }} />}
              <ListItemText primary={onj.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}