import { FC, ReactElement } from 'react';

import {
  Select as MuiSelect,
  InputLabel,
  FormControl,
  MenuItem,
  styled,
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
  handleCategoryChange: (selectedCategory: Category) => void;
}

const Select: FC<Props> = ({
  label,
  options,
  selectedCategory,
  handleCategoryChange,
}): ReactElement => {
  const labelId = 'selectId';
  return (
    <FormControl size='small'>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        id='category-select'
        labelId={labelId}
        aria-labelledby={labelId}
        value={selectedCategory ?? ''}
        onChange={({ target: { value } }) => handleCategoryChange(value)}
        label={label}
        sx={{ width: '15rem' }}
      >
        {options.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
