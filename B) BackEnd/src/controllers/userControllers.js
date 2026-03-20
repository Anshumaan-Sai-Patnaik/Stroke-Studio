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
    let user = { ...req.session.user };
    if(!user || user.userID != id) {
        res.redirect('http://localhost:3000/home');
    }
    else{
        delete user.password;
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

exports.updateUserProfile = async (req, res) => {
    if (req.body.checkPassword) {
        if (req.body.checkPassword === req.session.user.password) 
            return res.json({ message: true });
        else {
            return res.json({ message: false });
        }

    }

    let id = req.session.user.userID;
    const updateFields = {
        username: req.body.username
    };
    req.session.user.username = req.body.username;
    if (req.body.newPassword) {
        updateFields.password = req.body.newPassword;
        req.session.user.password = req.body.newPassword;
    }
    await User.updateOne(
        { userID: id },
        updateFields
    );
    res.json({ ok: true });
};
exports.updateUserList = async (req, res) => {
    let id = req.session.user.userID;
    let { action, paintingId } = req.body;

    if(action === 'cart-add') {
        await User.updateOne(
            { userID: id },
            { $addToSet: { cartItems: paintingId } }
        );
    }
    if(action === 'cart-remove') {
        await User.updateOne(
            { userID: id },
            { $pull: { cartItems: paintingId } }
        );
    }
    if(action === 'wish-add') {
        await User.updateOne(
            { userID: id },
            { $addToSet: { wishList: paintingId } }
        );
    }
    if(action === 'wish-remove') {
        await User.updateOne(
            { userID: id },
            { $pull: { wishList: paintingId } }
        );
    }
}

exports.deleteUser = async (req, res) => {
    let id = req.session.user.userID;
    await User.deleteOne({ userID: id });
    req.session.destroy(() => {
        res.json({ ok: true });
    });
}