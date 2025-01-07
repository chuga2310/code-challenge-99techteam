import React, { useRef, useState } from "react";
import "./index.css";

type Option = {
	value: string;
	label: string;
	icon: string;
};

interface SelectOptionProps {
	options: Option[];
	placeholder: string;
	onOptionSelect: (option: Option) => void;
	selectedOption: Option | null;
}

const SelectOption: React.FC<SelectOptionProps> = ({
	options,
	placeholder,
	onOptionSelect,
	selectedOption
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (option: Option) => {
		onOptionSelect(option);
		setIsOpen(false);
	};

	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!dropdownRef.current?.contains(e.relatedTarget)) {
			setIsOpen(false);
		}
	};

	return (
		<div className="select-container" ref={dropdownRef} tabIndex={0} onBlur={handleBlur}>
			<div className="select-header" onClick={() => setIsOpen(!isOpen)}>
				{selectedOption ? (
					<div className="selected-option">
						<img src={selectedOption.icon} alt={selectedOption.label} className="menu-icon" />
						<span>{selectedOption.label}</span>
					</div>
				) : (
					<span>{placeholder}</span>
				)}
				<span className="arrow">{isOpen ? "▲" : "▼"}</span>
			</div>

			{isOpen && (
				<ul className="select-options">
					{options.map((option) => (
						<li
							key={option.value}
							className="select-option"
							onClick={() => handleSelect(option)}
							tabIndex={0}
						>
							<img src={option.icon} alt={option.label} className="menu-icon" />
							<span>{option.label}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SelectOption;
