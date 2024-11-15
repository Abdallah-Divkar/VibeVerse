import User from '../models/user.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => { 
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({ 
            message: "Successfully signed up!"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) 
        });
    }
};

const list = async (req, res) => { 
    try {
        let users = await User.find().select('name email updated created');
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) 
        });
    }
};

const userByID = async (req, res, next, id) => { 
    try {
        let user = await User.findById(id);
        if (!user)
            return res.status('400').json({ 
                error: "User not found"
            });
        req.profile = user;
        next();
    } catch (err) {
        return res.status('400').json({ 
            error: "Could not retrieve user"
        });
    }
};

const read = (req, res) => {
    req.profile.hashed_password = undefined; 
    req.profile.salt = undefined;
    return res.json(req.profile);
};

const update = async (req, res) => { 
    try {
        let user = req.profile;
        user = extend(user, req.body);
        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined; 
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) 
        });
    }
};

const remove = async (req, res) => { 
    try {
        let user = req.profile;
        let deletedUser = await user.deleteOne();
        deletedUser.hashed_password = undefined; 
        deletedUser.salt = undefined;
        res.json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) 
        });
    }
};

// Función para seguir a un usuario
const follow = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {
            $push: { following: req.params.userId }
        }, { new: true });

        await User.findByIdAndUpdate(req.params.userId, {
            $push: { followers: req.body.userId }
        }, { new: true });

        res.status(200).json({ message: 'User followed successfully' });
    } catch (err) {
        return res.status(400).json({ error: 'Could not follow user' });
    }
};

// Función para dejar de seguir a un usuario
const unfollow = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, {
            $pull: { following: req.params.userId }
        }, { new: true });

        await User.findByIdAndUpdate(req.params.userId, {
            $pull: { followers: req.body.userId }
        }, { new: true });

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (err) {
        return res.status(400).json({ error: 'Could not unfollow user' });
    }
};

export default { create, userByID, read, list, remove, update, follow, unfollow };
