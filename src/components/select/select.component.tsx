import { FC, ReactElement, useContext } from 'react';

import { useRouter } from 'next/router';

import {
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent,
  styled,
} from '@mui/material';

import { Context } from '@/src/utils';

import { Category } from '@/src/utils/interfaces';

import { DEFAULT_SELECT_OPTION } from '@/src/utils/constants';

const Option = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.common.white,
}));

interface Props {
  options: { label: string; value: string }[];
}

const Select: FC<Props> = ({ options }): ReactElement => {
  const {
    updateCtx,
    ctx: { selectedCategory },
  } = useContext(Context);

  const { push } = useRouter();

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
      sx={{
        width: '15rem',
        padding: '0',
        '& 	.MuiSelect-select': {
          padding: '0.5rem',
        },
      }}
    >
      <Option
        disabled
        value={DEFAULT_SELECT_OPTION}
        sx={{ visibility: 'hidden' }}
      >
        {DEFAULT_SELECT_OPTION}
      </Option>
      {options.map(({ label, value }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </MuiSelect>
  );
};

export default Select;
