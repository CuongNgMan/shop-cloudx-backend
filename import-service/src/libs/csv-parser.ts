import { parse } from "csv-parse";
import { Readable } from "stream";

const parser = parse({ delimiter: ",", columns: true, trim: true });

type CSVEventHandler = {
  onData: Function;
};

export const csvParser = async (readable: Readable, { onData }: CSVEventHandler) => {
  return new Promise((resolve, reject) => {
    readable
      .pipe(parser)
      .on("data", (data) => onData(data))
      .on("end", () => resolve(true))
      .on("error", (error) => reject(error));
  });
};
