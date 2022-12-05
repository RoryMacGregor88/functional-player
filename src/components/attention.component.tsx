import { FC, ReactElement } from 'react';

interface Props {
  children: ReactElement;
}

const Attention: FC<Props> = ({ children }): ReactElement => (
  <span
    style={{
      fontWeight: 'bold',
      padding: '0.5rem',
      border: '2px solid lightblue',
      borderRadius: '3px',
      color: 'lightblue',
    }}
  >
    {children}
  </span>
);

export default Attention;
