export default function logServerError(handlerName, error) {
  console.log(`SERVER ERROR in ${handlerName}: `, error);
}
