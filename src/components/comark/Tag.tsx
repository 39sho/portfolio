interface TagProps {
	name: string;
}

export default function Tag({ name }: TagProps) {
	return (
		<span className="bg-neutral-200 px-2 py-0.5 rounded-full text-xs text-neutral-700">
			{name}
		</span>
	);
}
