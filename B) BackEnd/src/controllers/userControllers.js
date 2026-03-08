const User = require('../models/user');
const Painting = require('../models/list');

exports.runUser = async (req, res) => {
    let {email, password} = req.body;
    const user = await User.findOne({ emailID: email, password: password });
    if (!user) {
        return res.json({
            success: false,
            message: "Invalid credentials"
        });
    }
    else {
        req.session.user = user;
        return res.json({
            success: true,
            user: user
        });
    }
}

exports.quitUser = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('http://localhost:3000/home');
    });
}

exports.getUser = async (req, res) => {
    let {id} = req.params;
    let user = req.session.user;
    if(!user || user.userID != id) {
        res.redirect('http://localhost:3000/home');
    }
    else{
        const data_ = user;
        const data = await Painting.aggregate([
            { $sample: { size: 99 } }
        ]);
        res.render('userSpace', {
            userInfo: data_,
            allWorks: data,
        });
    }
};