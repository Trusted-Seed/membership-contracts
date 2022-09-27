import prompts from "prompts";
import { log } from "./logging";

export const confirmOK = async (): Promise<any> =>
  prompts({
    type: "confirm",
    name: "ok",
    message: "Are you sure you want to proceed?",
    initial: true,
  });

export const promptForConfirmation = async (): Promise<any> => {
  const { ok } = await confirmOK();
  if (!ok) {
    log.info("\nOperation aborted, exiting...");
    process.exit(0);
  }
};
