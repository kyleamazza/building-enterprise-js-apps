function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    return res
      .status(400)
      .set('Content-Type', 'application/json')
      .json({ message: 'Payload should be in JSON format' });
  }

  return next();
}

export default errorHandler;
