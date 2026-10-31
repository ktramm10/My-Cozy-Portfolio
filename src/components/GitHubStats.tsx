'use client';

import { useEffect, useState } from 'react';
import { GITHUB_USERNAME, type GitHubStats } from '@/util/github';

const ACTIVITY_WEEKS = 20;

export default function GitHubStats() {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/github').then((res) => {
            if (!res.ok) throw new Error('Request failed.');
            return res.json();
        }).then((data: GitHubStats) => setStats(data)).catch(() => setError("Couldn't load GitHub stats."));
    }, []);

    if (error) return <p className="gh-message">{error}</p>;
    if (!stats) return <p className="gh-message">Loading GitHub stats…</p>;

    const recentWeeks = stats.calendar.slice(-ACTIVITY_WEEKS);
    const languageTotal = stats.topLanguages.reduce((sum, lang) => sum + lang.count, 0);
    const languageMax = Math.max(...stats.topLanguages.map((lang) => lang.count));

    return (
        <section className="gh-stats" aria-label="GitHub statistics">
            <div className="sidebar-heading">
                <h2>GitHub</h2>
                <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                    @{GITHUB_USERNAME}
                </a>
            </div>

            <div className="gh-hero">
                <span className="gh-hero-value">{stats.contributions.toLocaleString()}</span>
                <span className="gh-hero-label">contributions this year</span>
            </div>

            <div className="gh-tiles">
                <Stat label="Repos" value={stats.repos} />
                <Stat label="Stars" value={stats.stars} />
                <Stat label="Languages" value={stats.topLanguages.length} />
            </div>

            <h3 className="sidebar-section-title">Top Languages</h3>
            <ul className="gh-languages">
                {stats.topLanguages.map((lang) => {
                    const percent = Math.round((lang.count / languageTotal) * 100);
                    return (
                        <li key={lang.name}>
                            <div className="gh-language-row">
                                <span>{lang.name}</span>
                                <span>{percent}%</span>
                            </div>
                            <div className="gh-language-bar">
                                <div style={{ width: `${(lang.count / languageMax) * 100}%` }} />
                            </div>
                        </li>
                    );
                })}
            </ul>

            <h3 className="sidebar-section-title">Recent Activity</h3>
            <div className="gh-activity" style={{ gridTemplateColumns: `repeat(${recentWeeks.length}, 1fr)` }}>
                {recentWeeks.map((week, i) => (
                    <div key={i} className="gh-activity-week">
                        {week.contributionDays.map((day) => (
                            <div
                                key={day.date}
                                title={`${day.contributionCount} contributions on ${day.date}`}
                                className="gh-activity-day"
                                data-level={activityLevel(day.contributionCount)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="gh-activity-legend" aria-hidden="true">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div key={level} className="gh-activity-day" data-level={level} />
                ))}
                <span>More</span>
            </div>
        </section>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="gh-tile">
            <span className="gh-tile-value">{value.toLocaleString()}</span>
            <span className="gh-tile-label">{label}</span>
        </div>
    );
}

function activityLevel(count: number) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
}
