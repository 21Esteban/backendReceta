import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generarToken.js";
import { response } from "../helpers/response.js";
import { userModel } from "../models/User.js";

const userCtrl = {};

userCtrl.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const passwordEncrypt = encryptPassword(password);

    const newUser = new userModel({
      name,
      email,
      password: passwordEncrypt,
    });

    await newUser.save();

    const token = generateToken({ user: newUser._id });

    response(
      res,
      201,
      true,
      { ...newUser._doc, password: null, token },
      "user created"
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

userCtrl.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken({ user: user._id });
      return response(
        res,
        200,
        true,
        { ...user.toJSON(), password: null, token },
        `Welcome... ${user.name}`
      );
    }
    response(res, 400, false, "", "incorrect email or password");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default userCtrl;
