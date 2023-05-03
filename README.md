# git-autocommit

`git-autocommit` is a simple tool that generates commit messages for your staged changes using OpenAI's GPT model. The tool provides a commit message adhering to the "conventional commits" format, making your commit history easy to understand and maintain.

## Prerequisites

- Node.js (v14+ recommended)
- Yarn or npm
- Git

## Installation

1. Clone the repository:

```
git clone https://github.com/username/git-autocommit.git
```

2. Navigate to the project directory:

```
cd git-autocommit
```

3. Install the dependencies:

```
yarn install
```

or

```
npm install
```

4. Set up your OpenAI API key as an environment variable:

```
export OPENAI_API_KEY=your_openai_api_key
```

Optionally, you can set the `USE_GPT4` environment variable to use the GPT-4 model instead of the default GPT-3.5-turbo:

```
export USE_GPT4=true
```

## Compiling the TypeScript code

1. Compile the TypeScript code using the `npx` command:

```
npx tsc
```

This will generate the JavaScript output in the `dist` directory.

## Executing the compiled code from another location

1. Create a `bin.sh` script in a directory that is included in your `$PATH`. For example, you can create the script in `/usr/local/bin`:

```
sudo touch /usr/local/bin/git-autocommit
sudo chmod +x /usr/local/bin/git-autocommit
```

2. Edit the `git-autocommit` script using your preferred text editor, such as `nano` or `vim`. Add the following content to the script:

```sh
#!/bin/sh
node ~/code/git-autocommit/dist
```

Replace `~/code/git-autocommit` with the full path to your `git-autocommit` project directory. This script assumes that the compiled JavaScript output is in the `dist` directory inside the project directory.

3. Save and exit the text editor.

4. Now you can execute the `git-autocommit` tool from any location in your terminal by running:

```
git-autocommit
```

The tool will generate a commit message for your staged changes and commit them to your repository using the generated message.

## Usage

1. Stage your changes in your Git repository using:

```
git add .
```

2. Run `git-autocommit`

The tool will generate a commit message for your staged changes and commit them to your repository using the generated message.

## Note

This tool is intended for use with OpenAI's GPT models, and an API key is required for it to function correctly. Please ensure you have a valid API key before using this tool.

This README, and all commit messages in this repository, were generated by GPT-4.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
