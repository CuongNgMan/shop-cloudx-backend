const getSignedUrlMock = jest.fn();

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: getSignedUrlMock,
}));

import { main } from "./handler";

describe("importProductFile handler", () => {
  it("should return 400 if missing file", async () => {
    const event = {
      queryStringParameters: {
        name: null,
      },
    };

    const response = await main(event, {}, () => {});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).data).toBeNull();
  });

  it("should return presigned url to update file", async () => {
    const event = {
      queryStringParameters: {
        name: "sample.csv",
      },
    };

    const mockSignedUrl = "https://signed-url.sample";

    getSignedUrlMock.mockResolvedValue(mockSignedUrl);

    const response = await main(event, {}, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).signedUrl).toEqual(mockSignedUrl);

    getSignedUrlMock.mockRestore();
  });

  it("should return 500 if error", async () => {
    const event = {
      queryStringParameters: {
        name: "sample.csv",
      },
    };

    getSignedUrlMock.mockRejectedValue(new Error("Internal error"));

    const mockCallback = jest.fn();

    await main(event, {}, mockCallback);

    expect(mockCallback).toBeCalledWith(null, { statusCode: 500, body: JSON.stringify({ error: "Internal Error" }) });
  });
});
