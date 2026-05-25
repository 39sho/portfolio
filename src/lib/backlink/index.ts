import { parse } from 'comark';
import { visit } from 'comark/utils';
import type { CollectionEntry } from "astro:content";

type GetBacklinks = (
    posts: CollectionEntry<"blog">[],
) => Promise<Map<string, string[]>>;

export const getBacklinks: GetBacklinks = async (posts) => {
    const collections: Set<string> = new Set(
        posts.map((post) => post.collection),
    );

    const forlinks = new Map(
        await Promise.all(
            posts.map(async (post) => {
                const tree = await parse(post.body ?? '');

                const links: string[] = [];
                visit(tree, (node) => {
                    return Array.isArray(node) && node[0] === 'a';
                }, (node) => {
                    const attrs = node[1] as Record<string, any>;
                    if (attrs?.href && typeof attrs.href === 'string') {
                        links.push(attrs.href);
                    }
                });

                const forlink = links
                    .filter(link => link.slice(0, 1) === '/')
                    .filter(link => [...collections.keys()].includes(link.split('/')[1]))
                    .map((link) => (link.slice(-1) == "/" ? link : link + "/"));

                return [`/${post.collection}/${post.id}/`, forlink] as const;
            }),
        ),
    );

    const backlinks = new Map<string, string[]>();

    forlinks.forEach((value, key, _map) => {
        value.forEach((link) =>
            backlinks.set(
                link,
                backlinks.get(link) == null
                    ? [key]
                    : [...backlinks.get(link)!, key],
            ),
        );
    });

    console.log("\n--- generating backlinks ---");
    console.log(backlinks);
    console.log("----------------------------\n");

    return backlinks;
};
