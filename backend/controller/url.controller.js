const linkService = require('../services/link.service');

exports.createLink = async (req, res) => {
  const link = await linkService.createLink({
    userId: req.user.id,
    longUrl: req.body.longUrl || req.body.originalUrl,
  });

  res.status(201).json(link);
};

exports.listLinks = async (req, res) => {
  const links = await linkService.listLinksForUser(req.user.id);
  res.json(links);
};

exports.getLinkDetails = async (req, res) => {
  const details = await linkService.getLinkDetails({
    userId: req.user.id,
    linkId: req.params.id,
  });

  res.json(details);
};

exports.deleteLink = async (req, res) => {
  await linkService.deleteLink({
    userId: req.user.id,
    linkId: req.params.id,
  });

  res.json({ message: 'Link deleted' });
};

exports.redirectToLink = async (req, res) => {
  const redirectUrl = await linkService.getRedirectUrlAndLogClick({
    slug: req.params.slug,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.get('User-Agent'),
  });

  res.redirect(302, redirectUrl);
};

