import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { promisify } from "util";
import { exec as execSync } from "child_process";
const exec = promisify(execSync);

const { OPENAI_API_KEY, USE_GPT4 } = process.env;

async function execWithStdIn(command: string, stdin: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execSync(command);
    let stdout = "";
    child.stdin?.write(stdin);
    child.stdin?.end();
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
  const { stdout: diff } = await exec("git diff --staged");
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
  await execWithStdIn("git commit -F -", commitMsg);
}

main().catch((e) => console.error(e));
