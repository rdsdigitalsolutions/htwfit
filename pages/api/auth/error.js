export default function handler(req, res) {
  res.redirect(307, `/?error=${req.query.error}`);
}
