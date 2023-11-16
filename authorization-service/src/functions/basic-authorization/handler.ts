const basicAuthorizer = async (event, _context, callback) => {
  console.log({ basicAuth: event });

  const { headers } = event;

  const authHeader = headers && headers.authorization;

  if (event.type !== "REQUEST" || !authHeader) {
    callback("Unauthorized");
  }

  const encodedCredentials = authHeader.replace("Basic ", "");

  if (!encodedCredentials) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({ message: "Token parameter is missing" }),
    });
  }

  try {
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf-8");
    const [providedUsername, providedPassword] = decodedCredentials.split("=");
    const expectedPassword = process.env[providedUsername];
    const effect = expectedPassword && expectedPassword === providedPassword ? "Allow" : "Deny";
    const policy = {
      principalId: encodedCredentials,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: event.routeArn,
          },
        ],
      },
    };

    callback(null, policy);
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: { message: `Unauthorized ${err?.message}` },
    });
  }
};

export const main = basicAuthorizer;
