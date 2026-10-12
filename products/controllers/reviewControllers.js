const db = require('../models')

const Review = db.reviews

//1. Add Review
const addReview = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Product ID from request params: ${id}`);//ank

        let data = {
            product_id: id,
            rating: req.body.rating,
            description: req.body.description
        };
        console.log('Review data to be created:', data);//ank

        const review = await Review.create(data);
        console.log('Review created successfully:', review);//ank

        res.status(200).send(review);
    } catch (error) {
        console.error('Error adding review:',error);//modified ank
        res.status(500).json({
            status: false,
            msg: 'Internal Server Error'
        });
    }
};

// 2. Get All Reviews
const getAllReviews = async (req, res) => {

    const reviews = await Review.findAll({});
    console.log('All reviews fetched successfully:', reviews);//ank
    res.status(200).send(reviews)

}

module.exports = {
    addReview,
    getAllReviews
}