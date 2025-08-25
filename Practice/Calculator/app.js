function calculate(operation) {
    var num1 = document.getElementById('num1');
    var num2 = document.getElementById('num2');
    var resultDiv = document.getElementById('result');
    var n1 = parseFloat(num1.value);
    var n2 = parseFloat(num2.value);
    var res;
    if (isNaN(n1) || isNaN(n2)) {
        res = "⚠️ Please enter both numbers!";
    }
    else {
        switch (operation) {
            case "add":
                res = "Result: ".concat(n1 + n2);
                break;
            case "sub":
                res = "Result: ".concat(n1 - n2);
                break;
            case "mul":
                res = "Result: ".concat(n1 * n2);
                break;
            case "div":
                res = n2 !== 0 ? "Result: ".concat(n1 / n2) : "⚠️ Cannot divide by zero!";
                break;
            default:
                res = "Invalid operation";
        }
    }
    resultDiv.innerText = res;
}
