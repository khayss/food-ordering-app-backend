/*
 * This function handles any error thrown while implementing a controller logic.
 * Params: The function takes in a controller function as argument
 * Notice: function returns a function that implements try and catch that passes the error to the next middleware which is the custom error handling middleware
 */
export function catchErrorFunc(controller) {
  return async function (req, res, next) {
    try {
      await controller(req, res);
    } catch (error) {
      next(error);
    }
  };
}
