import { parse, createParse } from "comark";
import toc from "comark/plugins/toc";
import highlight from "comark/plugins/highlight";
import githubLight from "@shikijs/themes/github-light";
import githubDark from "@shikijs/themes/github-dark";
import type { ComarkTree } from "comark";

// ブログ記事用: シンタックスハイライト + TOC を有効化
export const parsePost = createParse({
    plugins: [
        toc(),
        highlight({
            themes: {
                light: githubLight,
                dark: githubDark,
            },
        }),
    ],
});

// プロフィール等、シンプルなコンテンツ用: ハイライトのみ
export const parseSimple = createParse({
    plugins: [
        highlight({
            themes: {
                light: githubLight,
                dark: githubDark,
            },
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
                    dark: githubDark,
                },
            }),
        ],
    });
}
