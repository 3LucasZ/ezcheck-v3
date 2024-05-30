import { errorToast, successToast } from "./toasty";

export async function poster(
  path: string,
  body: any,
  toaster?: any,
  showSuccess?: boolean,
  plainText?: boolean
): Promise<Response> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status != 200) {
      if (toaster)
        errorToast(
          toaster,
          "" + (plainText ? await res.text() : await res.json())
        );
    } else {
      if (toaster && showSuccess) successToast(toaster, "Success!"); // Only if you want to show a success toast. However, they can get annoying to the user.
    }
    return res;
  } catch (error) {
    if (toaster) errorToast(toaster, "Unknown error: " + error);
    return new Response();
  }
}
