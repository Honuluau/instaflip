import { Check, ChevronDown, Download } from "lucide-react";
import { useState } from "react"

interface DropdownProps {
    options: string[]
}

export function Dropdown({ options }: DropdownProps) {
    const [showDropdown, setShowDropdown] = useState<Boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);

    const handleSelect = (newOption: string) => {
        setSelectedOption(newOption);
        console.log(newOption);
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

                {(showDropdown) ? (<></>) : (
                <>
                    <div className="dropdown-list">
                        {options.map((option, index) => (
                            <button key={index} onClick={() => handleSelect(option)}>
                                <span>{option}</span>
                                {(option == selectedOption) ? (
                                    <>
                                        <Check size={16} />
                                    </>) : (<></>)}
                            </button>
                        ))}
                    </div>
                </>
            )}
            </button>
        </>
    )
}