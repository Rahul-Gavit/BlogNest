const Secrete = require("../model/Secrete");
const User = require("../model/User");

//GET all secretes
exports.getAllSecreteController = async (req, res) => {
  try {
    const secret = await Secrete.find({});

    if (secret.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No secret posts found",
      });
    }

    return res.status(200).json({
      success: true,
      secreteCount: secret.length,
      message: "All secret posts",
      secret,
    });
  } catch (error) {
    console.error("Error while getting secrets:", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting secrets",
      error: error.message,
    });
  }
};

//Create Secrete
exports.createSecreteController = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).send({
        success: false,
        message: "Please enter content",
      });
    }

    const userId = req.userId;
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user",
      });
    }

    const newSecrete = new Secrete({
      user_id: userId,
      content,
      timestamp: new Date(),
    });

    const secrete = await newSecrete.save();
    existingUser.secretes.push(newSecrete);
    await existingUser.save();

    return res.status(201).send({
      success: true,
      message: "secrete created",
      secrete,
    });
  } catch (error) {
    console.error("Error while creating secrete:", error);
    return res.status(400).json({
      success: false,
      message: "Error while creating secrete",
      error: error.message,
    });
  }
};

// Update Secrete
exports.updateSecreteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedSecrete = await Secrete.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Secrete updated",
      secrete: updatedSecrete,
    });
  } catch (error) {
    console.error("Error while updating secrete:", error);
    return res.status(400).json({
      success: false,
      message: "Error while updating secrete",
      error: error.message,
    });
  }
};

// Delete Secrete
exports.deleteSecreteController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const secrete = await Secrete.findOneAndDelete({
      _id: id,
      user_id: userId,
    }).populate("user_id");

    if (!secrete) {
      return res.status(404).json({
        success: false,
        message:
          "Secrete not found or you do not have the authority to delete it",
      });
    }

    const user = secrete.user_id;
    user.secretes.pull(secrete);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Secrete deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting secrete:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting secrete",
      error: error.message,
    });
  }
};

//single secrete
// exports.getSecreteByIdController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const secrete = await Secrete.findById(id);

//     if (!secrete) {
//       return res.status(404).send({
//         success: false,
//         message: "blog not found for that id",
//       });
//     }
//     return res.status(200).send({
//       success: true,
//       message: "fetch single secrete",
//       secrete,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error while getting secretes",
//       error,
//     });
//   }
// };

//GET User Secrete
// exports.userSecreteController = async (req, res) => {
//   try {
//     const userSecrete = await User.findById(req.params.id).populate("secretes");
//     if (!userSecrete) {
//       return res.status(404).send({
//         success: false,
//         message: "Secrete not found with this id",
//       });
//     }
//     return res.status(200).send({
//       success: true,
//       message: "user secretes",
//       userSecrete,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error in user secrete",
//       error,
//     });
//   }
// };
