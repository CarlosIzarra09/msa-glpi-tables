export function notAllowedMethods(req, res) {
  return res.status(405).send();
}
