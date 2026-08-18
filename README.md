# VRC Knowledge

VRChat 関連の知見をまとめる個人用ドキュメントサイト。

このサイトは [VitePress](https://vitepress.dev) で構築され、
Cloudflare Workers の静的アセット機能を使ってデプロイされています。

## 開発環境 (Nix Flake + direnv)

[direnv](https://direnv.net) が `.envrc` で devShell と `.env` を自動ロードします。

```sh
direnv allow          # 初回のみ
cp .env.example .env  # 初回のみ: CF の API トークンを設定
pnpm install          # 依存関係のインストール (初回のみ)
pnpm dev              # ローカル開発サーバ (http://localhost:5173)
```

direnv を使わない場合は `nix develop` で devShell に入れます。

## デプロイ

GitHub Actions が `main` ブランチへの push のたびにビルドして
Cloudflare Workers へデプロイします。

必要なリポジトリ Secret:

| Secret | 説明 |
| --- | --- |
| `CF_API_TOKEN` | Cloudflare API トークン (Workers Scripts: Edit / Workers Static Assets: Edit 権限) |

初回デプロイ時に Workers サブドメイン (`vrc-knowledge.<account>.workers.dev`) が自動採番されます。

### 手動デプロイ (ローカルから)

`.env` の `CLOUDFLARE_API_TOKEN` を設定済みなら:

```sh
pnpm build
wrangler deploy
```

## 記事を書く

`docs/` 配下に Markdown を追加するだけです。サイドバーは
`docs/.vitepress/config.mts` で管理しています。

- 記事追加: `docs/catXX/foo.md` のようにカテゴリフォルダに入れて作成
- ビルド確認: `pnpm build`
- プレビュー: `pnpm preview`