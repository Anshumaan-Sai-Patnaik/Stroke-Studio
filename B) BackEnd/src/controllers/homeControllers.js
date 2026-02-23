const Painting = require('../models/list');

exports.getHome = async (req, res) => {
    const data = await Painting.aggregate([
        { $sample: { size: 99 } }
    ]);
    res.render('myHome', {
        cartItems: [],
        cartTotal: 0,
        cartCount: 0,
        user: req.session.user,
        worksData: data,
        heroDescription: 'A global marketplace connecting passionate artists with collectors who value originality, craftsmanship, and creative expression. Discover unique artworks, support independent creators, and bring meaningful art into your space.'
    });
};