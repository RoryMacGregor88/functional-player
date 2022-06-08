// TODO: formdata must be fully validated before reaching this point

// types
// export default async function subscribeHandler(formData) {
//   const res = await fetch("/api/subscribe", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   // TODO: is await required here?
//   return res.json();
// }

// TODO: deprecated, all done in 'register' now

/**
 * creates an inactive subscription on stripe servers
 * @param {object} formData
 */
export default async function subscribeHandler(formData) {
  const res = await fetch("/api/subscribe-new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // TODO: is await required here?
  return res.json();
}
