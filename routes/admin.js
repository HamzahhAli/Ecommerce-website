const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Banner = require('../models/Banner');

async function createAdminRouter() {
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = await import('@adminjs/express');
  const AdminJSMongoose = await import('@adminjs/mongoose');

  AdminJS.registerAdapter({
    Database: AdminJSMongoose.Database,
    Resource: AdminJSMongoose.Resource,
  });

  const adminJS = new AdminJS({
    resources: [
      {
        resource: Product,
        options: {
          properties: {
            section: {
              type: 'string',
              availableValues: [
                { value: 'featured', label: 'Featured' },
                { value: 'greatDeals', label: 'Great Deals' },
                { value: 'newArrivals', label: 'New Arrivals' },
                { value: 'topRated', label: 'Top Rated' },
              ],
            },
          },
        },
      },
      {
        resource: Banner,
        options: {
          properties: {
            imageUrl: { type: 'string' },
          },
        },
      },
    ],
    rootPath: '/admin',
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJS);
  return adminRouter;
}

createAdminRouter().then(adminRouter => {
  router.use(adminRouter);
}).catch(error => {
  console.error('Failed to initialize AdminJS:', error);
});

module.exports = router;
