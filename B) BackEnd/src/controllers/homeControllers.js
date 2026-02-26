const Painting = require('../models/list');

exports.getHome = async (req, res) => {
    const data_ = await Painting.find().sort({ _id: -1 }).limit(4);
    const data = await Painting.aggregate([
        { $sample: { size: 99 } }
    ]);
    res.render('myHome', {
        cartItems: [],
        cartTotal: 0,
        cartCount: 0,
        user: req.session.user,
        recentWorks: data_,
        allWorks: data,
    });
};