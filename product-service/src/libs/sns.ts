import { SNSClient, PublishCommand, PublishCommandInput } from "@aws-sdk/client-sns";

const sns = new SNSClient();

export const publish = async (message: any, topic: string, options: Partial<PublishCommandInput> = {}) => {
  const input: PublishCommandInput = {
    Message: JSON.stringify(message),
    TopicArn: topic,
    ...options,
  };
  const command = new PublishCommand(input);

  return sns.send(command);
};
