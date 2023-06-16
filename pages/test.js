import { useState } from 'react';

export default function NumberInput() {
  const [inputValue, setInputValue] = useState('');
  const [outputArray, setOutputArray] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const numbers = inputValue.split('||').map((num) => parseInt(num.trim(), 10));
    setOutputArray(numbers);
  };

  console.log(outputArray);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
      <div>Output: {outputArray}</div>
    </div>
  );
  
}