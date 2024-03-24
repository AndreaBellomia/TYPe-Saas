import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

import CheckIcon from '@mui/icons-material/Check';

import { TICKET_STATUSES } from "@/constants"

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

const names: { label: string, key: string }[] = [
  {
    label: 'Backlog',
    key: TICKET_STATUSES.BACKLOG,
  },
  {
    label: 'Da fare',
    key: TICKET_STATUSES.TODO,
  },
  {
    label: 'In lavorazione',
    key: TICKET_STATUSES.PROGRESS,
  },
  {
    label: 'Bloccato',
    key: TICKET_STATUSES.BLOCKED,
  },
  {
    label: 'Completo',
    key: TICKET_STATUSES.DONE,
  },
];

function getRenderValue(selected: Array<string>) {
  return selected.map((key) => names.find((obj) => obj.key === key)?.label).join(', ');
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
          input={<OutlinedInput placeholder="" />}
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