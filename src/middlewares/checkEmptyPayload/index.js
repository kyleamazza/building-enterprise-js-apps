function checkEmptyPayload(req, res, next) {
  const { method, headers } = req;
  if (['POST', 'PATCH', 'PUT'].includes(method) && (headers['content-length'] === '0' || !headers['content-length'])) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should not be empty' });
  }

  return next();
}

export default checkEmptyPayload;
