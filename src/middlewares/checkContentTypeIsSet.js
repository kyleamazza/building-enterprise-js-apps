function checkContentTypeIsSet(req, res, next) {
  const { headers } = req;
  if (!headers['content-type']) {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'The "Content-Type" header must be set for requests with a non-empty payload' });
  }

  return next();
}

export default checkContentTypeIsSet;
