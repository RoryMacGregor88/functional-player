import NextImage from 'next/image';
import { Grid } from '@mui/material';

const slideImages = [
  {
    src: '/strat-small',
    alt: 'Stratocaster',
  },
  {
    src: '/les-paul-small',
    alt: 'Telecaster',
  },
];

const getImage = ({ src, alt }) => {
  return (
    <Grid
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        height: '400px',
      }}
    >
      <NextImage
        key={alt}
        src={`${src}.jpg`}
        alt={alt}
        fill
        quality={100}
        style={{
          objectFit: 'cover',
          padding: '20px',
          background: '#efefef',
          color: '#000000',
        }}
      />
    </Grid>
  );
};

const Carousel = () => {
  return (
    <div
      style={{
        width: '50%',
        height: '20%',
        marginTop: '75px',
        border: '2px solid red',
      }}
    >
      {slideImages.map(getImage)}
    </div>
  );
};

export default Carousel;
