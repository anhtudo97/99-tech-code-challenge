// Implementation A: Using the arithmetic progression formula
var sum_to_n_a = function (n) {
    // The sum of first n natural numbers is given by the formula:
    // sum = n * (n + 1) / 2
    // This is the most efficient way (O(1) time complexity)
    return n * (n + 1) / 2;
};

// Implementation B: Using recursion
var sum_to_n_b = function (n) {
    // Base case: if n is less than or equal to 0, return 0
    // This stops the recursion for zero or negative values
    if (n <= 0) return 0;
    // Recursive case: sum n and the result of sum_to_n_b(n - 1)
    // This continues until n reaches the base case
    return n + sum_to_n_b(n - 1);
};

// Implementation C: Using an iterative for loop
var sum_to_n_c = function (n) {
    // Initialize sum to 0 before starting the loop
    let sum = 0;
    // Loop from 1 to n, adding each integer to sum
    for (let i = 1; i <= n; i++) {
        sum += i; // At each iteration, add the current i to sum
    }
    // After the loop ends, sum contains the result
    return sum;
};