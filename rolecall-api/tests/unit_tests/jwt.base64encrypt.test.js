const {base64Encrypt} = require('../../scripts/jwt');

/**
 * Test for wrong input types
 */
test('Base 64 encrypt should not accept anything but objects', () => {
    expect(() => base64Encrypt('string-input')).toThrow();
    expect(() => base64Encrypt(1234)).toThrow();
    expect(() => base64Encrypt([12, 34])).toThrow();
    expect(() => base64Encrypt(undefined)).toThrow();
    expect(() => base64Encrypt(null)).toThrow();
    expect(() => base64Encrypt(false)).toThrow();
});

/**
 * Test for correct input and output type
 */
test('Base 64 encrypt should encrypt emptyObject to e30 (string)', () => {
    const expected = 'e30';
    const actual = base64Encrypt({});

    expect(typeof actual).toBe('string');
    expect(actual).toBe(expected);
})

/**
 * Test for correct encryption
 */
test('Base 64 encrypt should encrypt TEST (object) to eyJ0ZXN0IjoiVEVTVCJ9 (string)', () => {
    const expected = 'eyJ0ZXN0IjoiVEVTVCJ9';
    const actual = base64Encrypt({test: 'TEST'});

    expect(actual).toBe(expected);
})

/**
 * Test for unicode input
 */
 test('Base 64 encrypt should encrypt object with unicode to eyJ1bmljb2RlIjoiVGhhbmtzIPCfmIoifQ (string)', () => {
    const expected = 'eyJ1bmljb2RlIjoiVGhhbmtzIPCfmIoifQ';
    const actual = base64Encrypt({unicode: "Thanks 😊"});

    expect(actual).toBe(expected);
})

/**
 * Test for long strings in object
 */
 test('Base 64 encrypt should encrypt object with long strings to be encrypted (string)', () => {
    const expected = 'eyJsb25nMSI6ImVWOHVvUng1SkViS3N5Z0ZFdW1KeENkODFidktwV0s5c0U1eXpkZUZwbVhYT21HRTc5M1QxYmI5ZUNidXRHMUxkWnNWaDEwS2VPM081WW5RTk0xeUZwUjNOMHJReHFDSHFsQVNSNjF0cnFuSGFMbVR2QlJtVEdEbXVvOXBmaVNvZVY4dW9SeDVKRWJLc3lnRkV1bUp4Q2Q4MWJ2S3BXSzlzRTV5emRlRnBtWFhPbUdFNzkzVDFiYjllQ2J1dEcxTGRac1ZoMTBLZU8zTzVZblFOTTF5RnBSM04wclF4cUNIcWxBU1I2MXRycW5IYUxtVHZCUm1UR0RtdW85cGZpU28iLCJsb25nMiI6ImVWOHVvUng1SkViS3N5Z0ZFdW1KeENkODFidktwV0s5c0U1eXpkZUZwbVhYT21HRTc5M1QxYmI5ZUNidXRHMUxkWnNWaDEwS2VPM081WW5RTk0xeUZwUjNOMHJReHFDSHFsQVNSNjF0cnFuSGFMbVR2QlJtVEdEbXVvOXBmaVNvZVY4dW9SeDVKRWJLc3lnRkV1bUp4Q2Q4MWJ2S3BXSzlzRTV5emRlRnBtWFhPbUdFNzkzVDFiYjllQ2J1dEcxTGRac1ZoMTBLZU8zTzVZblFOTTF5RnBSM04wclF4cUNIcWxBU1I2MXRycW5IYUxtVHZCUm1UR0RtdW85cGZpU28iLCJsb25nMyI6ImVWOHVvUng1SkViS3N5Z0ZFdW1KeENkODFidktwV0s5c0U1eXpkZUZwbVhYT21HRTc5M1QxYmI5ZUNidXRHMUxkWnNWaDEwS2VPM081WW5RTk0xeUZwUjNOMHJReHFDSHFsQVNSNjF0cnFuSGFMbVR2QlJtVEdEbXVvOXBmaVNvZVY4dW9SeDVKRWJLc3lnRkV1bUp4Q2Q4MWJ2S3BXSzlzRTV5emRlRnBtWFhPbUdFNzkzVDFiYjllQ2J1dEcxTGRac1ZoMTBLZU8zTzVZblFOTTF5RnBSM04wclF4cUNIcWxBU1I2MXRycW5IYUxtVHZCUm1UR0RtdW85cGZpU28ifQ';
    const actual = base64Encrypt({long1: "eV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSoeV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSo",
                                    long2: "eV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSoeV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSo",
                                    long3: "eV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSoeV8uoRx5JEbKsygFEumJxCd81bvKpWK9sE5yzdeFpmXXOmGE793T1bb9eCbutG1LdZsVh10KeO3O5YnQNM1yFpR3N0rQxqCHqlASR61trqnHaLmTvBRmTGDmuo9pfiSo"
                                });

    expect(actual).toBe(expected);
})

