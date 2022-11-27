import { FC, ReactElement, useState } from 'react';

import { useRouter } from 'next/router'

import { Select as MuiSelect, MenuItem, SelectChangeEvent } from '@mui/material';

const DEFAULT_OPTION = 'Explore by category';

interface Props {
  options: { label: string, value: string }[];
}

// TODO: select does not reset when navigating away

const Select: FC<Props> = ({ options }): ReactElement => {
  const { push } = useRouter()
  const [category, setCategory] = useState(DEFAULT_OPTION);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const category = e.target.value;
    setCategory(category);
    if (category !== DEFAULT_OPTION) {
      push(`/categories/?category=${category}`);
    }
  }

  return (
    <MuiSelect
      value={category}
      onChange={handleChange}
      sx={{ width: '15rem' }}
    >
      <MenuItem disabled value={DEFAULT_OPTION}>{DEFAULT_OPTION}</MenuItem>
      {options.map(({ label, value }) => (
        <MenuItem key={value} value={value}>{label}</MenuItem>
      ))}
    </MuiSelect>
  )
}

export default Select;
