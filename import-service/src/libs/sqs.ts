import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

const SQS = new SQSClient();

export const sendToQueue = async (data: any, queueUrl: string) => {
  const input: SendMessageCommandInput = {
    MessageBody: JSON.stringify(data),
    QueueUrl: queueUrl,
  };
  const command = new SendMessageCommand(input);

  return SQS.send(command);
};
