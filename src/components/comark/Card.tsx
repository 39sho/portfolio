interface CardProps {
	href: string;
	title: string;
	description?: string;
}

export default function Card({ href, title, description }: CardProps) {
	return (
		<a
			href={href}
			className="block border-2 border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition my-4 no-underline"
		>
			<h3 className="font-bold text-base mb-1">{title}</h3>
			{description && (
				<p className="text-sm text-neutral-500">{description}</p>
			)}
		</a>
	);
}
