const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/hash_password");

describe("hashPassword", () => {
    const password = "hashiranogeslo123";

    it("should return a hashed password", async () => {
        const hashedPassword = await hashPassword(password);

        expect(hashedPassword).not.toBe(password);

        const isMatch = await bcrypt.compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it("should throw an error if no password is provided", async () => {
        await expect(hashPassword()).rejects.toThrow();
    });
});
