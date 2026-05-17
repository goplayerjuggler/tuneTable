import crypto from "crypto";

const password = ""; //was replaced with real pwd
const hash = crypto.createHash("sha256").update(password).digest("hex");
console.log(hash);
