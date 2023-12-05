import type { CollectionKey } from "astro:content";
import type { CollectionEntry } from "astro:content";

type GetBacklinks = (
    posts: CollectionEntry<CollectionKey>[][],
) => Promise<Map<string, string[]>>;

export const getBacklinks: GetBacklinks = async (posts) => {
    const collections: Set<string> = new Set(
        posts.flat().map((post) => post.collection),
    );

    const forlinks = new Map(
        await Promise.all(
            posts.flat().map(async (post) => {
                const { remarkPluginFrontmatter } = await post.render();

                const forlink = (remarkPluginFrontmatter.forlink as string[])
                    .filter(link => link.slice(0, 1) === '/')
                    .filter(link => [...collections.keys()].includes(link.split('/')[1]))
                    .map((link) => (link.slice(-1) == "/" ? link : link + "/"));

                return [`/${post.collection}/${post.slug}/`, forlink] as const;
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