import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const privateKeyPath = path.join(process.cwd(), 'ai-aggregator.private-key.pem');

export async function getOctokit() {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
    installationId: process.env.GITHUB_INSTALLATION_ID!,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  });

  const authToken = await auth({ type: 'installation' });
  const octokit = new Octokit({ auth: authToken.token });

  return octokit;
}
