jest.mock('firebase-admin', () => {
    return {
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn().mockReturnValue({}),
      },
    };
  });
  