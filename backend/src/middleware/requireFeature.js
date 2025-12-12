import { resolveEntitlements } from '../entitlements.js';

export const requireFeature = (feature) => async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  const entitlements = await resolveEntitlements(userId);

  if (!entitlements.features[feature]) {
    return res.status(403).json({
      error: 'Upgrade required',
      plan: entitlements.plan
    });
  }

  req.entitlements = entitlements;
  next();
};
