import bcrypt from "bcrypt";

export async function createHash(data) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}
