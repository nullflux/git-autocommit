import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { exec } from "child_process";

const { OPENAI_API_KEY, USE_GPT4 } = process.env;

/**
 * Executes a shell command and returns the output as a Promise. Optionally accepts stdin input.
 *
 * @function
 * @async
 * @param {string} command - The shell command to execute.
 * @param {string} [stdin] - Optional input to be passed to the command via stdin.
 * @returns {Promise<string>} - A Promise that resolves with the command's stdout output.
 */
async function execHelper(command: string, stdin?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(command);
    if (stdin) {
      child.stdin?.write(stdin);
      child.stdin?.end();
    }
    let stdout = "";
    child.stdout?.on("data", (data) => {
      stdout += data;
    });
    child.on("close", (code) => {
      if (code != 0) {
        reject();
      } else {
        resolve(stdout);
      }
    });
  });
}

async function getChatCompletion(messages: ChatCompletionRequestMessage[]) {
  const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));
  const {
    data: {
      choices: [result],
      ...rest
    },
  } = await openai.createChatCompletion({
    model: USE_GPT4 ? "gpt-4" : "gpt-3.5-turbo",
    messages,
  });
  return { result, rest };
}

async function main() {
  const diff = await execHelper("git diff --staged");
  if (!diff) {
    console.info("No staged changes to commit");
    process.exit(0);
  }
  const response = await getChatCompletion([
    {
      role: "user",
      content: diff,
    },
    {
      role: "user",
      content:
        'The above is the result of `git diff`. Please provide a commit message, adhering to "conventional commits" for this change',
    },
  ]);
  const commitMsg = response.result.message?.content.trim();
  if (!commitMsg) {
    throw new Error("No commit message from GPT");
  }
  console.info(`Committing with:\n\n ${commitMsg}`);
  await execHelper("git commit -F -", commitMsg);
}

main().catch((e) => console.error(e));
