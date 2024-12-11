const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        //required: 'Name is required'
    },
    username: { 
        type: String,
        trim: true,
        unique: 'Username already exists',
        required: 'Username is required',
        minlength: [3, 'Username must be at least 3 characters.'],
        maxlength: [30, 'Username must not exceed 30 characters.'],
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: 500 
    },
    profilePic: { 
        type: String,
        default: 'https://res.cloudinary.com/daqkitloj/image/upload/v1733786820/default-profile-pic_axwxip.png', // Default profile picture
        // Optional validation for URL (if needed)
        /* validate: {
            validator: (url) => validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'Please provide a valid URL for the profile picture'
        } */
    },    
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    salt: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Virtual for setting and getting password
UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
});

UserSchema.methods.makeSalt = function() {
    return crypto.randomBytes(16).toString('hex');
};

// Method to hash the password
UserSchema.methods.encryptPassword = function(password) {
    if (!password) return '';
    try {
        return crypto
            .createHmac('sha256', this.salt)  // Using the salt to hash the password
            .update(password)
            .digest('hex');
    } catch (err) {
        return '';
    }
};

// Password validation
/*UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
}, null);*/

// Methods for password encryption and authentication
/*UserSchema.methods.authenticate = function(password) {
    return this.encryptPassword(password) === this.hashed_password;
};*/
/*UserSchema.methods.authenticate = function(password) {
    const hashedPassword = crypto
      .createHmac('sha256', this.salt)
      .update(password)
      .digest('hex');
    return hashedPassword === this.password; // Compare with the stored hashed password
  };*/
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }
};

module.exports = mongoose.model('User', UserSchema);
