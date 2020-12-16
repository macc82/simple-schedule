import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default ({onAddItemClick}) => {
    const [inputValue, setInputValue] = useState('');
    
    const handleAddButtonClick = () => {
        if (inputValue.trim() === '') return null;
        const newItem = {
            itemName: inputValue,
            quantity: 1,
            isSelected: false,
        };

        onAddItemClick(newItem);
        
        setInputValue('');
    };

    const onInputChange = (e) => setInputValue(e.currentTarget.value);

    return (
        <div className='add-item-box'>
            <input className='add-item-input' 
                placeholder='Add an item...' 
                value={inputValue} 
                onChange={onInputChange} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddButtonClick(); }} />
            <FontAwesomeIcon icon={faPlus} 
                onClick={handleAddButtonClick} />
        </div>
    );
};