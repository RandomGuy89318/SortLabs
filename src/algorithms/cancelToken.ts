export const cancelToken = {
  cancelled: false,
};

export function cancelSort() {
  cancelToken.cancelled = true;
}

export function resetCancelToken() {
  cancelToken.cancelled = false;
}
