const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "이메일을 입력해주세요"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "유효한 이메일 주소를 입력해주세요",
      ],
    },
    password: {
      type: String,
      required: [true, "비밀번호를 입력해주세요"],
      minlength: [4, "비밀번호는 최소 4자 이상이어야 합니다"],
      select: false, // 기본적으로 조회 시 비밀번호는 제외
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 비밀번호 저장 전 암호화
userSchema.pre("save", async function (next) {
  // 비밀번호가 수정되지 않았으면 다음으로
  if (!this.isModified("password")) {
    return next();
  }

  // 비밀번호 암호화
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
