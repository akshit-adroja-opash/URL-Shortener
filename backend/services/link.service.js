const { nanoid } = require('nanoid');
const Link = require('../models/Link');
const Click = require('../models/Click');
const AppError = require('../utils/AppError');

const MAX_SLUG_RETRIES = 5;

const serializeClick = (click) => ({
  id: click._id.toString(),
  ts: click.ts,
  timestamp: click.ts,
  ip: click.ip,
  userAgent: click.userAgent,
});

const serializeLink = (link) => ({
  id: link._id.toString(),
  _id: link._id.toString(),
  slug: link.slug,
  longUrl: link.longUrl,
  originalUrl: link.longUrl,
  clickCount: link.clickCount,
  clicks: link.clickCount,
  shortPath: `/r/${link.slug}`,
  createdAt: link.createdAt,
});

const isDuplicateSlugError = (error) => error && error.code === 11000 && error.keyPattern && error.keyPattern.slug;

const createLink = async ({ userId, longUrl }) => {
  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt += 1) {
    try {
      const link = await Link.create({
        userId,
        longUrl,
        slug: nanoid(8),
      });

      return serializeLink(link);
    } catch (error) {
      if (isDuplicateSlugError(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new AppError(503, 'Could not generate a unique slug after multiple attempts', 'SLUG_GENERATION_FAILED');
};

const listLinksForUser = async (userId) => {
  const links = await Link.find({ userId }).sort({ createdAt: -1 }).lean();
  return links.map(serializeLink);
};

const getOwnedLink = async ({ userId, linkId }) => {
  const link = await Link.findOne({ _id: linkId, userId });
  if (!link) {
    throw new AppError(404, 'Link not found', 'LINK_NOT_FOUND');
  }

  return link;
};

const getLinkDetails = async ({ userId, linkId }) => {
  const link = await getOwnedLink({ userId, linkId });
  const recentClicks = await Click.find({ linkId: link._id })
    .sort({ ts: -1 })
    .limit(20)
    .lean();

  return {
    ...serializeLink(link),
    recentClicks: recentClicks.map(serializeClick),
  };
};

const deleteLink = async ({ userId, linkId }) => {
  const link = await getOwnedLink({ userId, linkId });
  await Promise.all([
    Link.deleteOne({ _id: link._id }),
    Click.deleteMany({ linkId: link._id }),
  ]);
};

const getRedirectUrlAndLogClick = async ({ slug, ip, userAgent }) => {
  const link = await Link.findOne({ slug }).lean();
  if (!link) {
    throw new AppError(404, 'Short link not found', 'LINK_NOT_FOUND');
  }

  void Promise.allSettled([
    Click.create({
      linkId: link._id,
      ts: new Date(),
      ip,
      userAgent,
    }),
    Link.updateOne({ _id: link._id }, { $inc: { clickCount: 1 } }),
  ]);

  return link.longUrl;
};

module.exports = {
  createLink,
  listLinksForUser,
  getLinkDetails,
  deleteLink,
  getRedirectUrlAndLogClick,
};
