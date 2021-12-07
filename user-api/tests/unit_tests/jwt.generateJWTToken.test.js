const { createToken, verifySignature, getTokenData } = require("../../scripts/jwt");

/**
 * Test for wrong input types
 */
test("generate JWT Token should not accept anything but objects", () => {
  expect(() => createToken("{}")).toThrow();
  expect(() => createToken(1234)).toThrow();
  expect(() => createToken([12, 34])).toThrow();
  expect(() => createToken(undefined)).toThrow();
  expect(() => createToken(null)).toThrow();
  expect(() => createToken(false)).toThrow();
});

/**
 * Correct input type should not throw an error
 */
test("generate JWT Token should accept objects", () => {
  expect(() => createToken({})).not.toThrow();
});

/**
 * Generated token should contain identical data and correct header
 */
test("generate JWT Token should accept objects", () => {
  const payload = {
    user_id: "0001",
    role: "STUDENT",
  };

  const token = createToken(payload);

  getTokenData(token, (payload, header) => {
    expect(payload.user_id).toBe("0001");
    expect(payload.role).toBe("STUDENT");
    expect(header.alg).toBe("HS256");
    expect(header.typ).toBe("JWT");
  })

  expect(verifySignature(createToken(payload))).toBe(true);

});
