import { FC, ReactElement, useContext } from 'react';

import { useRouter } from 'next/router';

import {
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import { Context } from '@/src/utils';

import { Category } from '@/src/utils/interfaces';

import { DEFAULT_SELECT_OPTION } from '@/src/utils/constants';

interface Props {
  options: { label: string; value: string }[];
}

const Select: FC<Props> = ({ options }): ReactElement => {
  const { push } = useRouter();
  const {
    updateCtx,
    ctx: { selectedCategory },
  } = useContext(Context);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const selectedCategory: Category = e.target.value;
    updateCtx({ selectedCategory });
    if (selectedCategory !== DEFAULT_SELECT_OPTION) {
      push(`/categories/?category=${selectedCategory}`);
    }
  };

  return (
    <MuiSelect
      value={selectedCategory}
      onChange={handleChange}
      sx={{ width: '15rem' }}
    >
      <MenuItem disabled value={DEFAULT_SELECT_OPTION}>
        {DEFAULT_SELECT_OPTION}
      </MenuItem>
      {options.map(({ label, value }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default Select;
