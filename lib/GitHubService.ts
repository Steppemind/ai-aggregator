import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";
import path from "path";

// Загрузка переменных из окружения
const GITHUB_APP_ID = process.env.GITHUB_APP_ID!;
const GITHUB_PRIVATE_KEY_PATH = process.env.GITHUB_PRIVATE_KEY_PATH!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_INSTALLATION_ID = parseInt(process.env.GITHUB_INSTALLATION_ID!);
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME!;

// Чтение приватного ключа
const privateKey = fs.readFileSync(path.resolve(GITHUB_PRIVATE_KEY_PATH), "utf8");

// Создание экземпляра Octokit с авторизацией GitHub App
async function getOctokit() {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID,
      privateKey,
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      installationId: GITHUB_INSTALLATION_ID,
    },
  });
  return octokit;
}

// Функция обновления файла
async function editFileContent(filePath: string, newContent: string) {
  const octokit = await getOctokit();

  const { data: fileData } = await octokit.repos.getContent({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
  });

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `🔧 Обновление файла ${filePath}`,
    content: Buffer.from(newContent).toString("base64"),
    sha: (fileData as any).sha,
  });
}

// Функция создания нового файла
async function createFileContent(filePath: string, content: string) {
  const octokit = await getOctokit();

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    path: filePath,
    message: `📄 Создание нового файла: ${filePath}`,
    content: Buffer.from(content).toString("base64"),
  });
}

// ✅ Экспорт всех нужных функций
export { getOctokit, editFileContent, createFileContent };
