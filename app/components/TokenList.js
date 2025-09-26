'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Spinner component for loading state
const Spinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
    </div>
);

const SortableHeader = ({ children, sortKey, sortConfig, requestSort }) => {
    const isAscending = sortConfig.key === sortKey && sortConfig.direction === 'ascending';
    const isDescending = sortConfig.key === sortKey && sortConfig.direction === 'descending';

    return (
        <th className="p-2 cursor-pointer" onClick={() => requestSort(sortKey)}>
            {children}
            {isAscending && ' ▲'}
            {isDescending && ' ▼'}
        </th>
    );
};

const FormattedPrice = ({ price }) => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
        return <span>-</span>;
    }

    if (priceNum > 0 && priceNum < 0.0001) {
        const leadingZeros = -Math.floor(Math.log10(priceNum)) - 1;
        const decimals = leadingZeros + 5;
        return (
            <span title={priceNum.toString()}>
                ${priceNum.toFixed(decimals)}
            </span>
        );
    }
    
    if (priceNum === 0) {
        return <span>$0.0000</span>
    }

    return <span title={priceNum.toString()}>${priceNum.toFixed(4)}</span>;
};

const CircularCountdown = ({ countdown }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (countdown / 30) * circumference;

    return (
        <div className="relative w-10 h-10">
            <svg className="w-full h-full" viewBox="0 0 40 40">
                <circle
                    className="text-gray-600"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
                <circle
                    className="text-yellow-500"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                {countdown}
            </span>
        </div>
    );
};

export default function TokenList() {
    const [allTokens, setAllTokens] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'mulPoint', direction: 'descending' });
    const [countdown, setCountdown] = useState(30);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const tokensPerPage = 10;

    useEffect(() => {
        const fetchTokens = async (isInitialLoad = false) => {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }
            setError(null);
            try {
                const response = await fetch('https://www.binance.com/bapi/defi/v1/public/wallet-direct/buw/wallet/cex/alpha/all/token/list');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.code === "000000" && Array.isArray(result.data)) {
                    setAllTokens(result.data);
                } else {
                     throw new Error('Failed to fetch token data or invalid format');
                }
            } catch (e) {
                setError(e.message);
                console.error("Fetching token error:", e);
            } finally {
                if (isInitialLoad) {
                    setLoading(false);
                }
                setIsRefreshing(false);
                setCountdown(30);
            }
        };

        fetchTokens(true);

        const intervalId = setInterval(() => fetchTokens(false), 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const filteredAndSortedTokens = useMemo(() => {
        let filtered = allTokens.filter(token =>
            token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Convert to number if possible for numeric sorting
                if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [searchQuery, allTokens, sortConfig]);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on new search or sort
    }, [searchQuery, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Pagination logic
    const indexOfLastToken = currentPage * tokensPerPage;
    const indexOfFirstToken = indexOfLastToken - tokensPerPage;
    const currentTokens = filteredAndSortedTokens.slice(indexOfFirstToken, indexOfLastToken);
    const totalPages = Math.ceil(filteredAndSortedTokens.length / tokensPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const PriceChange = ({ value }) => {
        const change = parseFloat(value);
        const colorClass = change >= 0 ? 'text-green-400' : 'text-red-400';
        return <span className={colorClass}>{change.toFixed(2)}%</span>;
    };

    return (
        <div className="calculator-card p-8 rounded-xl shadow-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Alpha Token List</h2>
                <div className="flex items-center">
                    {isRefreshing && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-yellow-500 mr-3"></div>}
                    <CircularCountdown countdown={countdown} />
                </div>
            </div>
            <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className={`flex-grow overflow-y-auto transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                 {loading ? <Spinner /> : error ? <p className="text-red-400 text-center">{error}</p> : (
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-400">
                            <tr>
                                <SortableHeader sortKey="name" sortConfig={sortConfig} requestSort={requestSort}>Token</SortableHeader>
                                <SortableHeader sortKey="price" sortConfig={sortConfig} requestSort={requestSort}>Price (USD)</SortableHeader>
                                <SortableHeader sortKey="percentChange24h" sortConfig={sortConfig} requestSort={requestSort}>24h Change</SortableHeader>
                                <SortableHeader sortKey="mulPoint" sortConfig={sortConfig} requestSort={requestSort}>Multiplier</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {currentTokens.map((token) => (
                                <tr key={token.tokenId}>
                                    <td className="p-2 flex items-center space-x-3">
                                        <Image src={token.iconUrl} alt={token.name} width={32} height={32} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold text-white">{token.symbol}</p>
                                            <p className="text-xs text-gray-400">{token.name}</p>
                                        </div>
                                    </td>
                                    <td className="p-2 text-right font-mono text-white"><FormattedPrice price={token.price} /></td>
                                    <td className="p-2 text-right font-mono"><PriceChange value={token.percentChange24h} /></td>
                                    <td className="p-2 text-right font-semibold text-yellow-400">{token.mulPoint}x</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
                 { !loading && currentTokens.length === 0 && <p className="text-center text-gray-400 mt-8">No tokens found.</p> } 
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn-secondary">
                        Previous
                    </button>
                    <span className="text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn-secondary">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
