## 1. Issues \& Anti-patterns Present in the Source Code

### A. Filtering and Logic Mistake in useMemo

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {
   if (balance.amount <= 0) {
     return true;
   }
}
return false
```

- **Issue:**
    - Usage of undeclared variable (`lhsPriority` instead of `balancePriority`)
    - Reversed logic: filters to keep balances <= 0; typically you want to exclude such balances
    - Redundant nesting, making the code less readable


### B. Unused Variable in useMemo Dependencies

- **Issue:**
`prices` is in the deps array, but not used within the useMemo, causing unnecessary re-rendering.


### C. No Memoization of Balance Formatting (formattedBalances)

- **Issue:**
Formatted balances are recalculated every render, even when data hasn't changed.


### D. Incorrect Data Source and Type for Rendering Rows

- **Issue:**
Uses `sortedBalances` (type `WalletBalance`) for mapping to `WalletRow` components but passes data as seems it were a `FormattedWalletBalance` (with a `formatted` field, which is not present).


### E. Usage of index as the key in List Rendering

- **Issue:**
React recommends stable, unique keys (e.g., currency/id) to avoid rendering bugs and ensure proper reconciliation.


### F. Repeated Unnecessary Calls to getPriority

- **Issue:**
`getPriority` is called multiple times for each item during filtering, sorting, and mapping, which is inefficient.


### G. Lack of Type Safety (use of `any`)

- **Issue:**
`getPriority(blockchain: any)` — not type-safe, increasing risk of runtime bugs.


### H. Redundant Object Spreading

- **Minor:**
Acceptable for small objects, but explicit field construction is clearer and potentially more efficient.


### I. Using `.toFixed()` Without Specifying Decimals

- **Issue:**
`.toFixed()` defaults to 0 decimal places, which may be incorrect for balances.


### J. Prop Forwarding onto `<div> {...rest}`

- **Issue:**
If `BoxProps` contains props not valid for `<div>`, you may get console warnings or DOM errors.


## 2. Recommendations / Best Practices

- Fix filtering logic and variable naming.
- Only specify necessary dependencies for hooks.
- Memoize both the formatted balances and rendered rows.
- Map rendering using the correctly formatted data source.
- Choose a unique, stable key (e.g., `currency`, or id).
- Use strict types (preferably union or enum for blockchain).
- Minimize repeated calls to pure functions such as `getPriority`.
- Specify the number of decimals explicitly in `.toFixed(nDecimals)`.
- Check compatibility before forwarding props to DOM elements.


## 3. Refactored Code Example

```tsx
import React, { useMemo } from 'react';

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}
interface PricesMap {
  [currency: string]: number;
}
interface Props extends BoxProps {}

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa':
    case 'Neo': return 20;
    default: return -99;
  }
};

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoize normalized balances and sort before rendering
  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(balance => 
        getPriority(balance.blockchain) > -99 &&
        balance.amount > 0
      )
      .map(balance => ({
        ...balance,
        priority: getPriority(balance.blockchain),
        formatted: balance.amount.toFixed(2),
      }))
      .sort((a, b) => b.priority - a.priority);
  }, [balances]);

  // Memoize the row list
  const rows = useMemo(() => (
    formattedBalances.map((balance) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // assumes currency is unique; otherwise use a true id
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    })
  ), [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};
```


## 4. Refactor Summary Table

| Issue | Impact | Refactor Solution |
| :-- | :-- | :-- |
| Wrong filter logic | Incorrect results, difficult to debug | Clear, correct filter conditions |
| Unnecessary deps | Unneeded renders, performance loss | Remove unused deps |
| No memoization | Redundant renders/mappings, poor performance | Use useMemo for derived values |
| index as key | Rendering bugs, lost item state | Use unique, stable keys |
| Use of `any` | Unsafe, error-prone | Explicit types for blockchain |
| Redundant spread | Maintainability/performance (minor) | Use explicit fields where practical |
| .toFixed() unspecified | Loss of precision/clarity | Set desired decimal digits |
| Uncontrolled rest | Potential HTML warnings/errors | Strict control of forwarded props |

**You may copy and save this block as `walletpage_review.md` for future reference.**

