'use client';

import { useState } from 'react';

export default function Home() {
    const [volume, setVolume] = useState('');
    const [multiplier, setMultiplier] = useState(1);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const calculatePoints = () => {
        const dailyVolume = parseFloat(volume);

        if (isNaN(dailyVolume) || dailyVolume <= 0) {
            setError('Please enter a valid positive number for trading volume.');
            setResults(null);
            return;
        }

        setError('');

        const effectiveVolume = dailyVolume * multiplier;
        let dailyPoints = 0;

        if (effectiveVolume >= 2) {
            dailyPoints = Math.floor(Math.log2(effectiveVolume / 2)) + 1;
        }

        const totalPoints = dailyPoints * 15;

        setResults({
            dailyPoints,
            totalPoints,
            effectiveVolume,
        });
    };

    return (
        <div className="calculator-card w-full max-w-lg mx-auto p-8 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-2 text-white">Alpha Points Calculator</h1>
            <p className="text-center text-gray-400 mb-8">Estimate your Binance Alpha Points from trading volume.</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="volume" className="block text-sm font-medium mb-2 text-gray-300">How much money (USD) you want to trade daily?</label>
                    <input 
                        type="number" 
                        id="volume" 
                        className="input-field w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                        placeholder="e.g., 10000" 
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium mb-2 text-gray-300">Choose multiplier for event volume</label>
                    <select 
                        id="multiplier" 
                        className="input-field w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseInt(e.target.value))}
                    >
                        <option value="1">1x (Default)</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                    </select>
                </div>
            </div>

            <button onClick={calculatePoints} className="btn-primary w-full py-3 mt-8 rounded-lg font-semibold text-lg">Calculate Points</button>

            {results && (
                <div id="results" className="mt-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Estimated Earnings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div className="result-box p-4 rounded-lg border-l-4">
                            <p className="text-gray-400 text-sm">Volume Points Per Day</p>
                            <p id="dailyPoints" className="text-2xl font-bold text-white">{results.dailyPoints.toLocaleString()}</p>
                        </div>
                        <div className="result-box p-4 rounded-lg border-l-4">
                            <p className="text-gray-400 text-sm">Estimated in 15 Days</p>
                            <p id="totalPoints" className="text-2xl font-bold text-white">{results.totalPoints.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="explanation-box mt-6 p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-white">Calculation Explained</h3>
                        <p id="explanationText" className="text-gray-300 text-sm">
                            Your effective daily volume is <strong>${results.effectiveVolume.toLocaleString()}</strong> (Daily Volume ${parseFloat(volume).toLocaleString()} x {multiplier} multiplier).
                            <br /><br />
                            The formula used is: <code className="bg-gray-700 p-1 rounded">Points = floor(log2(Effective Volume / 2)) + 1</code>.
                            <br />Your calculation: <code className="bg-gray-700 p-1 rounded">floor(log2(${results.effectiveVolume.toLocaleString()} / 2)) + 1 = {results.dailyPoints.toLocaleString()}</code> points per day.
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div id="error" className="mt-6 text-red-400 text-center">
                    {error}
                </div>
            )}
        </div>
    );
}
