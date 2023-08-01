const mongoose = require('mongoose')
const faker = require('faker')
const Product = require("../models/product");
const Category = require("../models/category");

mongoose.connect('mongodb://localhost:27017/courses', {
    useNewUrlParser: true,
});

for (let i = 0; i < 4; i++) {
    const category = new Category({
        title: faker.name.title()
    })

    category.save()
        .then(categoryRef => {
            console.log(`${categoryRef.title} saved successfully`);
            for (let i = 0; i < 8; i++) {
                const product = new Product({
                    category: category._id,
                    productCode: faker.random.alpha(10),
                    title: faker.commerce.productName(),
                    imagePath: "https://antimatter.vn/wp-content/uploads/2022/10/hinh-anh-3d-800x500.jpg",
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price() * 10,
                    originalPrice: faker.commerce.price() * 20,
                    available: true,
                    linkForm: "https://www.youtube.com/watch?v=XmTLFtbv0Oo&ab_channel=KaiDinhOfficial"
                })

                product.save()
                    .then(productRef => {
                        console.log(`${categoryRef.title} - ${productRef.title}`)
                    })
            }
        })
}