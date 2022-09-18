import {
  http,
  DEFAULT_ERROR_MESSAGE,
  BOOKMARK_SUCCESS_REMOVE_MESSAGE,
  BOOKMARK_SUCCESS_ADD_MESSAGE,
} from ".";

// TODO: do something with this? Remember you have a dialog now!

// if (!ctx.user) {
//   return updateCtx({
//     dialogData: {
//       title: "You must be logged in to bookmark courses.",
//       message:
//         "Click below to log in or register if you don't already have an account.",
//       actions: [
//         {
//           label: "Login",
//           onClick: () => router.push("/login"),
//           closeOnClick: true,
//         },
//         {
//           label: "Register",
//           onClick: () => router.push("/register"),
//           closeOnClick: true,
//         },
//       ],
//     },
//   });

export default async function updateBookmarks(_id, user = {}, callback) {
  try {
    const { email, bookmarks: currentBookmarks } = user;
    const isBookmarked = currentBookmarks.includes(_id);

    const bookmarks = isBookmarked
      ? currentBookmarks.filter((b) => b !== _id)
      : [...currentBookmarks, _id];

    const { ok } = await http("/update-bookmarks", {
      email,
      bookmarks,
    });

    if (ok) {
      callback({
        user: { ...user, bookmarks },
        toastData: {
          message: isBookmarked
            ? BOOKMARK_SUCCESS_REMOVE_MESSAGE
            : BOOKMARK_SUCCESS_ADD_MESSAGE,
        },
      });
    }
  } catch (error) {
    callback({
      toastData: {
        message: DEFAULT_ERROR_MESSAGE,
        severity: "error",
      },
    });
  }
}
