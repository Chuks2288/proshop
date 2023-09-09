import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';



//@desc Auth user & token
//@route POST/api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password")
    }
});


//@desc Register user
//@route GET/api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User alreay exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@desc logout user/clear cookie
//@route GET/api/users
//@access private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

//@desc GET user profile
//@route GET/api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error('Invalid user data');
    }
});

//@desc update user profile
//@route PUT/api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const upatedUser = await user.save();

        res.status(200).json({
            _id: upatedUser._id,
            name: upatedUser.name,
            email: upatedUser.email,
            isAdmin: upatedUser.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error('User Not Found');
    }
});

//@desc get users
//@route GET/api/users
//@access private/admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users); getUsers
    // res.json(users);
});

//@desc get users by ID
//@route GET/api/users/:id
//@access private/admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");;
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(400);
        throw new Error("New user found");
    }
});

//@desc Delete users
//@route DELETE/api/users/:ID
//@access private/admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user")
        }
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User Deleted Successfully" });
    } else {
        res.status(400);
        throw new Error("No User Found")
    }
});

//@desc update users
//@route PUT/api/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});


export {
    authUser,
    registerUser,
    logoutUser,
    getUserById,
    getUserProfile,
    getUsers,
    updateUser,
    updateUserProfile,
    deleteUser,
}
