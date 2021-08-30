export default async function simplePromise(fn) {
  return new Promise((resolve, reject) => {
    fn((err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    });
  });
}
