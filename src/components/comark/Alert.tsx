import type { ReactNode } from "react";

interface AlertProps {
	type?: "info" | "warning" | "danger";
	children: ReactNode;
}

const styles = {
	info: "border-l-4 border-blue-400 bg-blue-50 text-blue-800",
	warning: "border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800",
	danger: "border-l-4 border-red-400 bg-red-50 text-red-800",
};

export default function Alert({ type = "info", children }: AlertProps) {
	return (
		<div className={`p-4 my-4 ${styles[type]}`}>
			{children}
		</div>
	);
}
