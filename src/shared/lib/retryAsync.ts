export const retryAsync = async <T>({
  cb,
  retries = 3,
  delayBetween = 350,
  currentAttempt = 1,
}: {
  cb: () => Promise<T>;
  retries: number;
  delayBetween: number;
  currentAttempt?: number;
}): Promise<T> => {
  try {
    return await cb();
  } catch (error) {
    console.error('Error in retryAsync', error);
    if (retries > 0) {
      const delay =
        error instanceof Response && error.status === 503
          ? currentAttempt === 1
            ? 1000
            : currentAttempt === 2
              ? 2000
              : delayBetween
          : delayBetween;

      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryAsync({
        cb,
        retries: retries - 1,
        delayBetween,
        currentAttempt: currentAttempt + 1,
      });
    } else {
      return Promise.reject(error);
    }
  }
};
