1. Issues and Improvements

- `FormattedWalletBalance` should extends `WalletBalance`

  ```ts
  interface WalletBalance {
  	currency: string;
  	amount: number;
  }
  interface FormattedWalletBalance extends WalletBalance {
  	formatted: string;
  }
  ```

2. Interface `Props` interface does not need to be initialized if there are no new properties and no need type for props in params

3. `children` is unused and no need `rest` for use in `<div>`

4. Function `getPriority`

- Need change param `blockchain:any` to `currency:WalletBalance['currency']`
- Can be use MappedSolution for get currency's priority.

5. In `sortedBalances` memo

- `lhsPriority` not defined. Change `lhsPriority` to `balancePriority`
- Incorrect Filtering Logic
  ```ts
  /** Current version */        /** Update version */
  if (balance.amount <= 0) {     | if (balance.amount > 0) {
    return true;                 |   return true
  }                              | }
  ```
- Improve solution in `sort`
  ```ts
  .sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
      return -1;
    } else if (rightPriority > leftPriority) {
      return 1;
    }
  });
  ```
  change to:
  ```ts
  .sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    return getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
  });
  ```
- No need `prices` in dependencies

6. `formattedBalances` need have type `FormattedWalletBalance[]`

7. `rows`

- Need map from `formattedBalances`
- `key` should not use `index` because it have type `number`, can use `balance.currency + index`

---

## Updated version

```ts
interface WalletBalance {
	currency: string;
	amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
	formatted: string;
}

const WalletPage: React.FC<BoxProps> = (props) => {
	const balances = useWalletBalances();
	const prices = usePrices();

	const priorityMap: { [key in WalletBalance["currency"]]: number } = {
		Osmosis: 100,
		Ethereum: 50,
		Arbitrum: 30,
		Zilliqa: 20,
		Neo: 20
	};

	const getPriority = (currency: WalletBalance["currency"]): number => {
		return priorityMap[currency] ?? -99;
	};

	const sortedBalances = useMemo(() => {
		return balances
			.filter((balance: WalletBalance) => {
				const balancePriority = getPriority(balance.blockchain);
				return balancePriority > -99 && balance.amount > 0;
			})
			.sort((lhs: WalletBalance, rhs: WalletBalance) => {
				const leftPriority = getPriority(lhs.blockchain);
				const rightPriority = getPriority(rhs.blockchain);
				getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
			});
	}, [balances]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

 const rows = formattedBalances.map((balance, index) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={balance.currency + index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
  return (
    <div {...props}>
      {rows}
    </div>
  )
}
```
