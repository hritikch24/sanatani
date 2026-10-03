'use client';

import Link from 'next/link';
import '../panchang/panchang.css';

const TOOLS = [
  { href: '/panchang', icon: '☀', title: 'दैनिक पंचांग', description: 'अपने शहर की तिथि और सूर्य का समय', label: 'दिन की शुरुआत' },
  { href: '/hindu-calendar', icon: '☾', title: 'हिंदू कैलेंडर', description: 'महीने भर के चंद्र तिथि संकेत', label: 'मासिक दर्शन' },
  { href: '/ekadashi', icon: '✦', title: 'एकादशी', description: 'व्रत की परंपरा और तिथि संकेत', label: 'श्रद्धा और संयम' },
  { href: '/chalisa', icon: 'ॐ', title: 'हनुमान चालीसा', description: 'संपूर्ण पाठ, सरल हिंदी अर्थ सहित', label: 'भक्ति का समय' },
];

export default function DailyTools() {
  return (
    <section className="daily-tools" lang="hi" aria-label="दैनिक साधना के उपयोगी साधन">
      <div className="dt-inner">
        <header className="dt-heading">
          <span className="dt-eyebrow">॥ दिनचर्या में धर्म ॥</span>
          <h2>हर दिन, आस्था के साथ</h2>
          <p>तिथि जानें, दिन सँवारें और भक्ति से जुड़ें।</p>
        </header>
        <div className="dt-grid">
          {TOOLS.map(tool => (
            <Link className="dt-card" href={tool.href} key={tool.href}>
              <span className="dt-card-top"><span className="dt-icon" aria-hidden="true">{tool.icon}</span><span className="dt-arrow" aria-hidden="true">↗</span></span>
              <span className="dt-label">{tool.label}</span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
