import githubLight from "@shikijs/themes/github-light";
import type { ComarkTree } from "comark";
import { createParse, parse } from "comark";
import highlight from "comark/plugins/highlight";
import toc from "comark/plugins/toc";

// ブログ記事用: シンタックスハイライト + TOC を有効化
export const parsePost = createParse({
	plugins: [
		toc(),
		highlight({
			themes: {
				light: githubLight,
			},
			preStyles: true,
		}),
	],
});

// プロフィール等、シンプルなコンテンツ用: ハイライトのみ
export const parseSimple = createParse({
	plugins: [
		highlight({
			themes: {
				light: githubLight,
			},
			preStyles: true,
		}),
	],
});

// 生の Markdown テキストをパースして ComarkTree を返す
export async function parseContent(body: string): Promise<ComarkTree> {
	return parse(body, {
		plugins: [
			highlight({
				themes: {
					light: githubLight,
				},
				preStyles: true,
			}),
		],
	});
}
