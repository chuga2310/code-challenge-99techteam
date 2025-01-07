import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./App.css";
import { fetchTokenPrices } from "./utils/api";
import { getLatestTokenPrices, Token } from "./utils/tokenUtils";
import SelectOption from "./components/SelectOption";
import { validateAmount } from "./utils/validation";

// Environment variable for token icon path
const TOKEN_ICON_BASE_URL = import.meta.env.VITE_TOKEN_ICON_BASE_URL;

const App: React.FC = () => {
	const [tokenPrices, setTokenPrices] = useState<Token[]>([]);
	const [inputAmount, setInputAmount] = useState<string>("0");
	const [inputToken, setInputToken] = useState<string>("ETH");
	const [outputToken, setOutputToken] = useState<string>("USD");
	const [outputAmount, setOutputAmount] = useState<number>(0);
	const inputAmountRef = useRef<HTMLInputElement>(null);
  
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = e.target.value.replace(/^0+(?=\d)|(?<=\d)0+$/, '');
    setInputAmount(formattedValue);
  }
	// Fetch token prices from the API
	useEffect(() => {
		const fetchPrices = async () => {
			const prices = await fetchTokenPrices();
			const latestPrices = getLatestTokenPrices(prices);
			setTokenPrices(latestPrices);
		};

		fetchPrices();
	}, []);

	// Calculate the output amount
	const calculateOutputAmount = useCallback(() => {
		const inputPrice = tokenPrices.find((t) => t.currency === inputToken)?.price || 1;
		const outputPrice = tokenPrices.find((t) => t.currency === outputToken)?.price || 1;
		const result = (Number(inputAmount) * inputPrice) / outputPrice;
		setOutputAmount(result);
	}, [inputAmount, inputToken, outputToken, tokenPrices]);

	useEffect(() => {
		if (tokenPrices.length > 0) {
			calculateOutputAmount();
		}
	}, [calculateOutputAmount, inputAmount, inputToken, outputToken, tokenPrices]);

	// Function to switch the input and output tokens
	const handleSwitchTokens = () => {
		setInputToken(outputToken);
		setOutputToken(inputToken);
	};

	// Memoized filtered tokens for the output dropdown
	const filteredOutputTokensMapToOption = useMemo(
		() =>
			tokenPrices
				.filter((token) => token.currency !== inputToken)
				.map((token) => ({
					value: token.currency,
					label: token.currency,
					icon: `${TOKEN_ICON_BASE_URL}/${token.currency}.svg`
				})),
		[inputToken, tokenPrices]
	);

	// Memoized filtered tokens for the input dropdown
	const filteredInputTokensMapToOption = useMemo(
		() =>
			tokenPrices
				.filter((token) => token.currency !== outputToken)
				.map((token) => ({
					value: token.currency,
					label: token.currency,
					icon: `${TOKEN_ICON_BASE_URL}/${token.currency}.svg`
				})),
		[outputToken, tokenPrices]
	);

	const isValidInputAmount = validateAmount(Number(inputAmount || 0).toString());

	const onSwap = () => {
		if (!isValidInputAmount) {
			inputAmountRef.current?.focus();
			return;
		}
		alert(`Swapping ${inputAmount} ${inputToken} to ${outputAmount.toFixed(6)} ${outputToken}`);
	};

	return (
		<div className="token-swap-container">
			<h1>Token Swap</h1>

			{/* Input Amount */}
			<div className="form-group">
				<label>Enter Amount</label>
				<input
					value={inputAmount}
					onChange={onChangeInput}
					className={`${!isValidInputAmount ? "error-input" : ""}`}
					ref={inputAmountRef}
				/>
				{!isValidInputAmount ? (
					<span className="error-message">Please enter a valid amount</span>
				) : null}
			</div>

			{/* From and To Select Fields in One Row with Switch Button */}
			<div className="form-group row">
				{/* From Dropdown */}
				<div className="column">
					<label>From</label>
					<SelectOption
						options={filteredInputTokensMapToOption}
						placeholder="Select Token"
						onOptionSelect={(option) => setInputToken(option.value)}
						selectedOption={{
							value: inputToken,
							label: inputToken,
							icon: `${TOKEN_ICON_BASE_URL}/${inputToken}.svg`
						}}
					/>
				</div>

				<div className="switch-button">
					<button onClick={handleSwitchTokens}>🔄</button>
				</div>

				<div className="column">
					<label>To</label>
					<SelectOption
						options={filteredOutputTokensMapToOption}
						placeholder="Select Token"
						onOptionSelect={(option) => setOutputToken(option.value)}
						selectedOption={{
							value: outputToken,
							label: outputToken,
							icon: `${TOKEN_ICON_BASE_URL}/${outputToken}.svg`
						}}
					/>
				</div>
			</div>

			{/* Output Amount */}
			<div className="output-amount">
				<p>
					You will receive:{" "}
					<span>
						{outputAmount.toFixed(6)} {outputToken}
					</span>
				</p>
			</div>

			{/* Swap Button */}
			<button onClick={onSwap}>Swap</button>
		</div>
	);
};

export default App;
