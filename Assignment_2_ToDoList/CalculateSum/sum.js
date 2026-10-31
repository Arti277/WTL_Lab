
const input1 = document.getElementById('num1');
const input2 = document.getElementById('num2');
const button = document.getElementById('sumBtn');
const resultSpan = document.getElementById('result');


button.addEventListener('click', () => {
    
    const value1 = parseFloat(input1.value) || 0; 
    const value2 = parseFloat(input2.value) || 0;

    
    const total = value1 + value2;

    
    resultSpan.textContent = total;
});
