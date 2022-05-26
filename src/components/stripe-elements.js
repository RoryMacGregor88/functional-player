import {
  CardElement as StripeCardElement,
  CardNumberElement as StripeCardNumberElement,
  CardExpiryElement as StripeCardExpiryElement,
  CardCvcElement as StripeCardCvcElement,
} from "@stripe/react-stripe-js";

// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles(theme => ({
//   element: {
//     padding: '1rem',
//     iconColor: '#faf9f7',
//     width: '100%',
//     color: '#faf9f7',
//     backgroundColor: '#080808',
//     border: '2px solid transparent',
//     borderRadius: '5px',
//   },
// }));

const OPTIONS = {
  style: {
    base: {
      iconColor: "#faf9f7",
      color: "#faf9f7",
      "::placeholder": {
        color: "#757575",
      },
      height: "10rem",
      width: "100%",
      border: "2px solid hotpink",
    },
  },
};

/**
 * @param {{onChange: function}} props
 */
const CardElement = ({ onChange }) => {
  return (
    <StripeCardElement
      options={OPTIONS}
      onChange={onChange}
      // className={{
      //   padding: "1rem",
      //   iconColor: "#faf9f7",
      //   width: "100%",
      //   color: "#faf9f7",
      //   backgroundColor: "#080808",
      //   border: "2px solid transparent",
      //   borderRadius: "5px",
      // }}
    />
  );
};

const CardNumberElement = ({ onChange }) => (
  <StripeCardNumberElement options={OPTIONS} onChange={onChange} />
);

const CardExpiryElement = ({ onChange }) => (
  <StripeCardExpiryElement options={OPTIONS} onChange={onChange} />
);

const CardCvcElement = ({ onChange }) => (
  <StripeCardCvcElement options={OPTIONS} onChange={onChange} />
);

export { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement };
