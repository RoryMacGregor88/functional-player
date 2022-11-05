/** @param {{ children: React.ReactChildren }} props */
const Attention = ({ children }) => (
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
