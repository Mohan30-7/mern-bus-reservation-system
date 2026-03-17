const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  // Check if the stored password looks like a bcrypt hash
  const isHashed = this.password.startsWith("$2a$") || this.password.startsWith("$2b$");
  
  if (isHashed) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  
  // Fallback for plain-text passwords
  return candidatePassword === this.password;
};

module.exports = mongoose.model("User", userSchema);

