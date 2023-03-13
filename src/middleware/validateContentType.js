export function validateContentType(req, res, next) {
  const { body = {} } = req;
  if (Object.keys(body).length > 0) {
    return res.status(406).send();
  }
  next();
}
