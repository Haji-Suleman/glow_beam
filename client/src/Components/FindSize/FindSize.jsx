import React, { useState } from 'react';
import './FindSize.css';

const SIZES = [
    { size: 'XS', us: '0-2', in: '25-27', cm: '64-69' },
    { size: 'S', us: '4-6', in: '28-29', cm: '71-74' },
    { size: 'M', us: '8-10', in: '30-32', cm: '76-81' },
    { size: 'L', us: '12-14', in: '34-37', cm: '86-94' },
    { size: 'XL', us: '16-18', in: '39-41', cm: '99-104' },
    { size: '2XL', us: '20-22', in: '42-44', cm: '107-112' },
    { size: '3XL', us: '24-26', in: '45-46', cm: '114-117' },
    { size: '4XL', us: '28-30', in: '47-48', cm: '119-122' },
    { size: '5XL', us: '32-34', in: '49-50', cm: '124-127' },
];

const FindSize = ({ isOpen, onClose, onChooseColor }) => {
    const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'chart'
    const [unit, setUnit] = useState('in'); // 'in' | 'cm'
    const [waist, setWaist] = useState('');
    const [result, setResult] = useState('');

    if (!isOpen) return null;

    const handleCalculate = () => {
        const w = Number(waist);
        if (!w) {
            setResult('Please enter a valid number.');
            return;
        }

        // Basic logic: find the range it falls into
        let foundSize = '';
        if (unit === 'in') {
            if (w <= 27) foundSize = 'XS';
            else if (w <= 29) foundSize = 'S';
            else if (w <= 32) foundSize = 'M';
            else if (w <= 37) foundSize = 'L';
            else if (w <= 41) foundSize = 'XL';
            else if (w <= 44) foundSize = '2XL';
            else if (w <= 46) foundSize = '3XL';
            else if (w <= 48) foundSize = '4XL';
            else foundSize = '5XL';
        } else {
            if (w <= 69) foundSize = 'XS';
            else if (w <= 74) foundSize = 'S';
            else if (w <= 81) foundSize = 'M';
            else if (w <= 94) foundSize = 'L';
            else if (w <= 104) foundSize = 'XL';
            else if (w <= 112) foundSize = '2XL';
            else if (w <= 117) foundSize = '3XL';
            else if (w <= 122) foundSize = '4XL';
            else foundSize = '5XL';
        }

        setResult(`Your perfect fit is ${foundSize}!`);
    };

    return (
        <div className="fs-overlay" onClick={onClose}>
            <div className="fs-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="fs-header">
                    <div>
                        <h2>Find your perfect fit</h2>
                        <p>SAYBEAM SCULPT BRIEF</p>
                    </div>
                    {/* Kept the "X" SVG here because a waist image shouldn't close the modal */}
                    <button className="fs-close" onClick={onClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {/* Tabs */}
                <div className="fs-tabs">
                    <button
                        className={`fs-tab ${activeTab === 'calculator' ? 'active' : ''}`}
                        onClick={() => setActiveTab('calculator')}
                    >
                        Size Calculator
                    </button>
                    <button
                        className={`fs-tab ${activeTab === 'chart' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chart')}
                    >
                        Size Chart
                    </button>
                </div>

                {/* Body */}
                <div className="fs-body">
                    {activeTab === 'calculator' ? (
                        <div className="fs-calc">
                            <h3>What's your waist?</h3>
                            <p className="fs-desc">
                                Measure around the narrowest part of your torso, a couple of inches <b>above</b> your belly button.
                                Postpartum tip: measure above your belly, not across the fullest part of it.
                            </p>

                            <div className="fs-unit-toggle">
                                <button type="button" className={unit === 'in' ? 'active' : ''} onClick={() => setUnit('in')}>INCHES</button>
                                <span>|</span>
                                <button type="button" className={unit === 'cm' ? 'active' : ''} onClick={() => setUnit('cm')}>CM</button>
                            </div>

                            <div className="fs-input-group">
                                <input
                                    type="number"
                                    placeholder="e.g. 32"
                                    value={waist}
                                    onChange={(e) => setWaist(e.target.value)}
                                />
                                <span>{unit}</span>
                            </div>

                            <button type="button" className="fs-btn-primary" onClick={handleCalculate}>
                                Find my size
                            </button>

                            {result && <p className="fs-result">{result}</p>}

                            <button type="button" className="fs-link" onClick={() => setActiveTab('chart')}>
                                Can't measure right now? Go one size up from your usual ›
                            </button>
                        </div>
                    ) : (
                        <div className="fs-chart">
                            <div className="fs-unit-toggle">
                                <button type="button" className={unit === 'in' ? 'active' : ''} onClick={() => setUnit('in')}>INCHES</button>
                                <span>|</span>
                                <button type="button" className={unit === 'cm' ? 'active' : ''} onClick={() => setUnit('cm')}>CM</button>
                            </div>

                            <div className="fs-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Size</th>
                                            <th>US</th>
                                            <th>Waist</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SIZES.map((row) => (
                                            <tr key={row.size}>
                                                <td className="fs-bold">{row.size}</td>
                                                <td>{row.us}</td>
                                                <td>{unit === 'in' ? `${row.in} in` : `${row.cm} cm`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="fs-how-to">
                                <div className="fs-how-img">
                                    {/* USED YOUR IMAGE HERE */}
                                    <img
                                        src="https://cdn.shopify.com/s/files/1/0940/8321/9834/files/waist.png?v=1782576057"
                                        alt="How to measure your waist"
                                    />
                                </div>
                                <div className="fs-how-text">
                                    <h4>How to measure.</h4>
                                    <p>Measure around the narrowest part of your torso, a couple of inches above your belly button, keeping the tape level. If you're postpartum, measure above the fullest part of your belly, not across it.</p>
                                </div>
                            </div>

                            <ul className="fs-tips">
                                <li><b>Sizing tip.</b> Go by your waist measurement, not your usual clothing size. After a baby the two often stop matching. Between two sizes? We recommend sizing up for the most comfortable fit.</li>
                                <li><b>Fabric.</b> A sculpting, four-way-stretch seamless fabric that adapts to your shape, supportive without ever feeling too tight.</li>
                                <li><b>Easy exchange.</b> Wrong size when it arrives? No stress, just email us and we'll ship you the right one, free.</li>
                                <li><b>90-day fit guarantee.</b> Try it risk-free for 90 days. If it isn't right for you, we'll make it right, with a free size exchange or your money back.</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="fs-footer">
                    <p className="fs-guarantee">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        90-day fit guarantee · Free size exchange
                    </p>
                    <button type="button" className="fs-btn-primary" onClick={onChooseColor}>
                        Choose My Color ›
                    </button>
                </footer>

            </div>
        </div>
    );
};

export default FindSize;