export default function secret({ user }) {
  return !!user ? <h1>SECRET CONTENT</h1> : <h1>You are not authenticated</h1>;
}
