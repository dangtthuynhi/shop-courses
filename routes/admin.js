const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require("@admin-bro/mongoose");
const Category = require("../models/category");
const Product = require("../models/product");
const mongoose = require("mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const express = require('express');
const app = express();

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    companyName: "Thế giới chậu",
    softwareBrothers: false,
  },
  resources: [
    {
      resource: Category,
      options: {
        listProperties: ['title', 'slug'],
        filterProperties: ['title', 'slug'],
        editProperties: ['title', 'slug'],
        showProperties: ['title', 'slug'],
        properties: {
          title: { isTitle: true },
        },
      },
    },
    {
      resource: Product,
      options: {
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
        listProperties: ['productCode', 'title', 'category', 'createdAt'],
        filterProperties: ['productCode', 'title', 'category', 'price', 'available', 'createdAt'],
        editProperties: ['productCode', 'title', 'category', 'imagePath', 'price', 'originalPrice', 'description', 'linkForm','available', 'createdAt'],
        showProperties: ['productCode', 'title', 'category', 'imagePath', 'price', 'originalPrice', 'description', 'linkForm', 'available', 'createdAt'],
        properties: {
          description: { type: "richtext" },
          title: { isTitle: true, },
          createdAt: { type: "datetime" },
        },
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        loginWelcome: "Admin Panel Login",
        Product: 'Khóa học',
        Category: 'Danh mục khóa học',
      },
      resources: {
        Product: {
          properties: {
            description: 'Mô tả',
            title: 'Tên khóa học',
            price: 'Giá',
            originalPrice: 'Giá gốc',
            imagePath: 'Link hình ảnh',
            productCode: 'Mã khóa học',
            createdAt: 'Thời gian tạo',
            category: 'Danh mục',
            available: 'Có sẵn',
            linkForm : 'Link đăng ký'
          }
        },
        Category: {
          properties: {
            title: 'Tên danh mục'
          }
        },
      }
    },
    messages: {
      loginWelcome:
        "Please enter your credentials to log in and manage your website contents",
    },
  },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN;
    }
    return null;
  },
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
});
// const router = AdminBroExpress.buildRouter(adminBro)

app.use(adminBro.options.rootPath, router)

module.exports = router;
