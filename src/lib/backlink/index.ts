import type { CollectionEntry } from "astro:content";
import { type ComarkNode, type ComarkTree, parse } from "comark";
import { visit } from "comark/utils";

type Post = CollectionEntry<"blog">;

/**
 * Markdown コンテンツ内の内部リンクを抽出して、バックリンクのマップを生成する。
 *
 * 各記事を comark でパースし、a タグの href 属性から / で始まる内部リンクを抽出。
 * 他の記事へリンクしている関係を逆転させて、「この記事へリンクしている記事一覧」を返す。
 */
export async function getBacklinks(
	posts: Post[],
): Promise<Map<string, string[]>> {
	const validCollections = new Set<string>(
		posts.map((post) => post.collection),
	);

	// 各記事 → その記事内の内部リンク
	const forwardLinks = new Map(
		await Promise.all(
			posts.map(async (post) => {
				const tree = await parse(post.body ?? "");
				const links = extractInternalLinks(tree);

				const normalizedLinks = links
					.filter((link) => link.startsWith("/"))
					.filter((link) => validCollections.has(link.split("/")[1]))
					.map((link) => (link.endsWith("/") ? link : `${link}/`));

				return [`/${post.collection}/${post.id}/`, normalizedLinks] as const;
			}),
		),
	);

	// 逆転: リンク先 → リンク元の記事
	const backlinks = new Map<string, string[]>();
	for (const [source, targets] of forwardLinks) {
		for (const target of targets) {
			const existing = backlinks.get(target);
			backlinks.set(target, existing ? [...existing, source] : [source]);
		}
	}

	console.log("\n--- generating backlinks ---");
	console.log(backlinks);
	console.log("----------------------------\n");

	return backlinks;
}

/**
 * comark AST から a タグの href 属性値を全て抽出する。
 */
function extractInternalLinks(tree: ComarkTree): string[] {
	const links: string[] = [];

	visit(tree, isAnchorElement, (node) => {
		const [, attrs] = node as [string, Record<string, unknown>];
		const href = attrs?.href;
		if (typeof href === "string") {
			links.push(href);
		}
	});

	return links;
}

/**
 * comark AST ノードが a 要素かどうかを判定する。
 * comark の要素ノードは [tag, attrs, ...children] の形式。
 */
function isAnchorElement(node: ComarkNode): boolean {
	return Array.isArray(node) && node[0] === "a";
}
