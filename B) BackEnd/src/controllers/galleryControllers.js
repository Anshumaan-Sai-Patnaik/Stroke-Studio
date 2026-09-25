const Painting = require('../models/list');

exports.getGallery = async (req, res) => {
    if(!req.session.user) {
        const data = await Painting.aggregate([
            { $sample: { size: 99 } }
        ]);
        res.render('myGallery', {
            allWorks: data,
        });
    }
    else{
        user = req.session.user
        res.redirect(`/user/${user.userID}`);
    }
};