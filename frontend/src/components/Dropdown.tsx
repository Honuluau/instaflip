import { Check, ChevronDown, Download } from "lucide-react";
import { useEffect, useState } from "react"

interface DropdownProps {
    options: string[],
    setOption: Function
}

export function Dropdown({ options, setOption }: DropdownProps) {
    const [showDropdown, setShowDropdown] = useState<Boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);

    const handleSelect = (newOption: string) => {
        setSelectedOption(newOption);
        setOption(newOption);
    }

    const handleShow = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <>
            <button className="dropdown-button" onClick={handleShow}>
                <Download size={20} />
                <span>{selectedOption}</span>
                <ChevronDown size={20} />

                {(showDropdown) ? (
                    <>
                        <div className="dropdown-list">
                            {options.map((option, index) => (
                                <button key={index} onClick={() => handleSelect(option)}>
                                    <span>{option}</span>
                                    {(option == selectedOption) ? (
                                        <>
                                            <Check size={16} />
                                        </>) : (<>
                                            <Check size={16} opacity={0} />
                                        </>)}
                                </button>
                            ))}
                        </div>
                    </>) : (<></>)}
            </button>
        </>
    )
}