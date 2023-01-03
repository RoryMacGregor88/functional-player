import { FC, ReactElement } from 'react';

import {
  Select as MuiSelect,
  InputLabel,
  FormControl,
  MenuItem,
  styled,
  SelectChangeEvent,
} from '@mui/material';

import { Category } from '@/src/utils/interfaces';

const Option = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.common.white,
}));

interface Props {
  label: string;
  options: { label: string; value: string }[];
  selectedCategory: Category | null;
  handleCategoryChange: (e: SelectChangeEvent<string>) => void;
}

const Select: FC<Props> = ({
  label,
  options,
  selectedCategory,
  handleCategoryChange,
}): ReactElement => (
  <FormControl fullWidth>
    <InputLabel id='category-select-label'>{label}</InputLabel>
    <MuiSelect
      id='category-select'
      value={selectedCategory}
      onChange={handleCategoryChange}
      label={label}
      labelId='category-select-label'
      sx={{
        width: '15rem',
        '& 	.MuiSelect-select': {
          padding: '0.5rem',
        },
      }}
    >
      {options.map(({ label, value }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </MuiSelect>
  </FormControl>
);

export default Select;
