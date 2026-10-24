import React, { useState } from 'react';
import './ProductGuaranteeFaq.css';

const faqData = [
    {
        question: "How is this different from a regular girdle or shaper?",
        answer: "Most shapers and postpartum belts only compress the front of your belly, which is exactly why they roll down and only flatten one spot. The Saybeam Sculpt Brief uses a <strong>360-degree circular compression</strong> that supports the entire midsection, so it stays in place and smooths your shape from every angle. It also has <strong>crossed support panels</strong> that lift and hold the belly, instead of just squishing it down."
    },
    {
        question: "Which size should I order?",
        answer: "Go by your <strong>waist measurement</strong>, not your usual clothing size. After a baby the two often stop matching, and that's exactly who this is made for. Measure around the <strong>narrowest part of your torso</strong>, a couple of inches above your belly button, keeping the tape level, and if you're postpartum measure <strong>above</strong> the fullest part of your belly rather than across it. Then match it to the size chart above. Between two sizes? <strong>Size up.</strong> The range runs from S all the way up to 5XL, and the <strong>Size Calculator</strong> on this page will do it for you in ten seconds."
    },
    {
        question: "Will it roll down or slide during the day?",
        answer: "No. The wide crossed band wraps all the way around, so it <strong>stays put through a full day</strong>, even when you sit, bend or move. No rolling down, no riding up, no readjusting in the bathroom."
    },
    {
        question: "Will it show under my clothes?",
        answer: "No. The fabric is thin and <strong>seamless</strong> with no visible edges, so it disappears under fitted dresses, jeans, leggings and work clothes. Just a smooth, natural line."
    },
    {
        question: "Is it comfortable enough to wear all day?",
        answer: "Yes. It's soft, breathable and lightweight, and it shapes <strong>without that breath-crushing squeeze</strong> of rigid shapers. Most women say they forget they're even wearing it, from morning to night."
    },
    {
        question: "When can I start wearing it after giving birth?",
        answer: "Most women start around <strong>2 weeks after a vaginal birth</strong> and <strong>6 weeks after a C-section</strong>, once they've been cleared. There's no hard boning, just soft seamless support. If you're recovering from surgery, check with your provider first."
    },
    {
        question: "Does it still help years after pregnancy?",
        answer: "Absolutely. Whether you gave birth a few weeks ago or several years ago, it supports and holds your core the same way. Plenty of customers order it long after their last pregnancy, or simply for everyday shaping."
    },
    {
        question: "What is it made of, and is it breathable?",
        answer: "A soft, <strong>four-way-stretch seamless blend</strong> designed to move with you and breathe against the skin, so it stays comfortable even in warmer weather. No itchy seams, no hard plastic, no visible stitching."
    },
    {
        question: "How do I wash and care for it?",
        answer: "Machine wash cold on a gentle cycle (a mesh laundry bag helps) and <strong>air-dry</strong>. Avoid bleach, fabric softener and the dryer, that keeps the elastic and the 360° band working like new."
    },
    {
        question: "How soon will I see a difference, and what if it's not for me?",
        answer: "You'll look <strong>flat and smooth</strong> under your clothes the moment you put it on. With daily wear, most women say their midsection feels firmer within 2 to 3 weeks. And it's backed by a <strong>90-day fit guarantee</strong>: wear it risk-free, and if it's not right for you, just reach out and we'll make it right, with a size exchange or your money back."
    }
];

const ProductGuaranteeFaq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="guarantee-faq-section">

            {/* Guarantee Box */}
            <div className="guarantee-box animate-fade-in-up">
                <div className="shield-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>
                </div>

                <h2 className="guarantee-title">
                    <span className="cursive-text">Love It</span> or Your Money Back
                </h2>

                <p className="guarantee-desc">
                    We're so sure the Saybeam Sculpt Brief will change how you feel in your clothes that we take on all the risk. Wear it for 90 days. If you don't see a smoother, flatter shape, or it's simply not for you, just reach out and we'll make it right, with a size exchange or your money back.
                </p>

                <button className="guarantee-btn btn-interactive">Get My Sculpt Brief</button>

                <div className="guarantee-features">
                    <span>✓ 90-Day Fit Guarantee</span>
                    <span>✓ Worldwide Shipping</span>
                    <span>✓ Money-Back Promise</span>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section animate-fade-in-up delay-1">
                <h2 className="faq-title">Frequently Asked Questions</h2>

                <div className="faq-list">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`faq-item ${isOpen ? 'active' : ''}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="question-text">{item.question}</span>
                                    <span className={`faq-icon ${isOpen ? 'is-open' : ''}`}>
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path className="horizontal-line" d="M1 7h12" />
                                            <path className="vertical-line" d="M7 1v12" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Smooth Grid Expansion Wrapper */}
                                <div className={`faq-answer-wrapper ${isOpen ? 'open' : ''}`}>
                                    <div className="faq-answer-inner">
                                        <div
                                            className="faq-answer-content"
                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bottom-cta-wrapper animate-fade-in-up delay-2">
                <button className="bottom-cta-btn btn-interactive">Order Now – Ships in 24h</button>
            </div>

        </div>
    );
};

export default ProductGuaranteeFaq;