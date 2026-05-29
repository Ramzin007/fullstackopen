const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  req.token = auth?.startsWith('Bearer ')
    ? auth.replace('Bearer ', '')
    : null

  next()
}

module.exports = tokenExtractor