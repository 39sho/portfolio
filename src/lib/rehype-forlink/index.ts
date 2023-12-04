import type { RehypePlugin } from "@astrojs/markdown-remark";
import { setVfileFrontmatter } from "@astrojs/markdown-remark";
import type hast from "hast";
import { visit } from "unist-util-visit";

const plugin: RehypePlugin = () => (tree, file) => {
    const forlinkNodes: hast.Element[] = [];
    visit(tree, (node, _index, _parent) => {
        if (node.type === 'element' && node.tagName === 'a')
            forlinkNodes.push(node);
    });

    setVfileFrontmatter(file, {
        forlink: forlinkNodes
            .map(node =>
                node.properties == null ?
                    {} :
                    node.properties
            )
            .map(properties => properties.href)
            .filter((link): link is string => typeof link == 'string'),
    });
};

export default plugin;