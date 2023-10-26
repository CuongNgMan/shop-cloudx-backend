import { ReadStream } from "fs";
import { parse } from "csv-parse";
import { Readable } from "stream";

const parser = parse({ delimiter: ",", columns: true, trim: true });

const assignToNumber = (input: string) => {
  let value = Number(input);

  if (Number.isNaN(value)) {
    value = 0;
  }

  return value;
};

export const csvParser = async (readable: Readable) => {
  const results = [];
  return new Promise((resolve, reject) => {
    readable
      .pipe(parser)
      .on("data", (data) => {
        console.log(data);
        data.price = assignToNumber(data.price);
        data.count = assignToNumber(data.count);
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
