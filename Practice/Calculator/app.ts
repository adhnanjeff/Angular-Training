function calculate(operation: string): void {
  const num1 = document.getElementById('num1') as HTMLInputElement;
  const num2 = document.getElementById('num2') as HTMLInputElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  const n1 = parseFloat(num1.value);
  const n2 = parseFloat(num2.value);
  let res: string;

  if (isNaN(n1) || isNaN(n2)) {
    res = "⚠️ Please enter both numbers!";
  } else {
    switch (operation) {
      case "add":
        res = `Result: ${n1 + n2}`;
        break;
      case "sub":
        res = `Result: ${n1 - n2}`;
        break;
      case "mul":
        res = `Result: ${n1 * n2}`;
        break;
      case "div":
        res = n2 !== 0 ? `Result: ${n1 / n2}` : "⚠️ Cannot divide by zero!";
        break;
      default:
        res = "Invalid operation";
    }
  }

  resultDiv.innerText = res;
}
