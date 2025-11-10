import React from 'react';

// --- SVG Icons ---
// Using inline SVGs so no external libraries are needed.

const CrownIcon = () => (
  <svg
    className="w-8 h-8 text-orange-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10.94 2.11l-2.03 4.12c-.2.41-.6.7-1.05.74l-4.54.66c-1.1.16-1.54 1.51-.74 2.3l3.29 3.2c.3.3.44.75.38 1.18l-.77 4.51c-.19 1.08.96 1.9 1.95 1.4l4.06-2.13c.39-.2.85-.2 1.24 0l4.06 2.13c.99.5 2.14-.32 1.95-1.4l-.77-4.51c-.06-.43.08-.88.38-1.18l3.29-3.2c.8-.79.36-2.14-.74-2.3l-4.54-.66c-.45-.05-.85-.33-1.05-.74l-2.03-4.12a1.2 1.2 0 00-2.12 0z"
      clipRule="evenodd"
    />
    <path
      d="M10.94 2.11l-2.03 4.12c-.2.41-.6.7-1.05.74l-4.54.66c-1.1.16-1.54 1.51-.74 2.3l3.29 3.2c.3.3.44.75.38 1.18l-.77 4.51c-.19 1.08.96 1.9 1.95 1.4l4.06-2.13c.39-.2.85-.2 1.24 0l4.06 2.13c.99.5 2.14-.32 1.95-1.4l-.77-4.51c-.06-.43.08-.88.38-1.18l3.29-3.2c.8-.79.36-2.14-.74-2.3l-4.54-.66c-.45-.05-.85-.33-1.05-.74l-2.03-4.12a1.2 1.2 0 00-2.12 0z"
      stroke="orange"
      strokeWidth="2"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    className="w-5 h-5 text-yellow-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.799 2.318l-4.25 3.623 1.22 5.354c.27 1.18-1.01 2.12-2.05 1.52L12 18.22l-4.98 2.99c-1.04.6-2.32-.34-2.05-1.52l1.22-5.354-4.25-3.623c-.837-.773-.365-2.225.799-2.318l5.404-.433L10.788 3.21z"
      clipRule="evenodd"
    />
  </svg>
);

const TrophyIcon = ({ className }) => (
  <svg
    className={`w-24 h-24 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9a.75.75 0 00-.75.75v.001c0 .414.336.75.75.75h9a.75.75 0 00.75-.75v-.001a.75.75 0 00-.75-.75zM12.75 6.031c-1.12 0-2.23.39-3.13.98l-1.42-1.42a.75.75 0 00-1.06 1.06l1.42 1.42a6.72 6.72 0 00-.98 3.13h-2.1a.75.75 0 000 1.5h2.1c.07 1.13.39 2.23.98 3.13l-1.42 1.42a.75.75 0 001.06 1.06l1.42-1.42a6.72 6.72 0 003.13.98v2.1a.75.75 0 001.5 0v-2.1c1.13-.07 2.23-.39 3.13-.98l1.42 1.42a.75.75 0 001.06-1.06l-1.42-1.42a6.72 6.72 0 00.98-3.13h2.1a.75.75 0 000-1.5h-2.1a6.72 6.72 0 00-.98-3.13l1.42-1.42a.75.75 0 00-1.06-1.06l-1.42 1.42a6.72 6.72 0 00-3.13-.98V4.125a.75.75 0 00-1.5 0v1.906zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
    />
  </svg>
);

// --- Mock Data ---
const ranksData = [
  {
    rank: 2,
    user: {
      name: 'Kent Nathanael',
      avatar: '../public/kent.png',
      stars: 52,
    },
    level: {
      text: 'Lv 8',
      icon: 'B',
      colors: 'bg-pink-100 text-pink-700',
      shape: 'rounded-lg',
    },
    podium: {
      height: 'h-48',
      colors: 'bg-gray-100 border-gray-300',
      rank: 'text-gray-300',
      trophy: 'text-gray-400',
    },
  },
  {
    rank: 1,
    user: {
      name: 'Ni Nyoman Diah Saraswati Devitri ',
      avatar: '../public/diah.png',
      stars: 70,
      hasCrown: true,
      border: 'border-pink-400',
    },
    level: {
      text: 'Lv 9',
      icon: '9',
      colors: 'bg-green-100 text-green-700',
      shape: 'rounded-full',
    },
    podium: {
      height: 'h-64',
      colors: 'bg-yellow-100 border-yellow-300',
      rank: 'text-yellow-300',
      trophy: 'text-yellow-500',
    },
  },
  {
    rank: 3,
    user: {
      name: 'Ong, Cornellius Jason Fernando',
      avatar: '../public/jason.png',
      stars: 42,
    },
    level: {
      text: 'Lv 7',
      icon: '7',
      colors: 'bg-blue-100 text-blue-700',
      shape: 'rounded-lg',
    },
    podium: {
      height: 'h-40',
      colors: 'bg-orange-100 border-orange-200',
      rank: 'text-orange-300',
      trophy: 'text-orange-400',
    },
  },
];

// --- Components ---

/**
 * Renders the level badge (e.g., "Lv 8")
 */
const LevelBadge = ({ level }) => {
  const { text, icon, colors, shape } = level;
  const isCircular = shape === 'rounded-full';

  return (
    <div
      className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 ${colors} ${shape} shadow-sm`}
    >
      {/* For Rank 9, we show icon and text. For others, just text. */}
      {isCircular ? (
        <>
          <span className="font-bold text-sm">{icon}</span>
          <span className="text-xs font-semibold">{text}</span>
        </>
      ) : (
        <>
          <span className="font-bold text-sm">{icon}</span>
          <span className="text-xs font-semibold">{text}</span>
        </>
      )}
    </div>
  );
};

/**
 * Renders the podium box (the colored block)
 */
const PodiumBox = ({ rank, podium, level }) => {
  return (
    <div
      className={`relative w-full ${podium.height} ${podium.colors} rounded-t-xl border-t-4 border-x-4 flex items-center justify-center overflow-hidden shadow-inner`}
    >
      <LevelBadge level={level} />
      <span
        className={`absolute text-9xl font-bold ${podium.rank} opacity-50`}
      >
        {rank}
      </span>
    </div>
  );
};

/**
 * Renders the user info (avatar, name, stars)
 */
const UserInfo = ({ user }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2">
        {user.hasCrown && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <CrownIcon />
          </div>
        )}
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-24 h-24 rounded-full border-4 ${
            user.border || 'border-transparent'
          } shadow-md`}
          onError={(e) => {
            e.target.src = `https://placehold.co/100x100/ccc/333?text=${user.name
              .charAt(0)
              .toUpperCase()}`;
          }}
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
      <div className="flex items-center gap-1">
        <StarIcon />
        <span className="text-gray-600 font-semibold">{user.stars}</span>
      </div>
    </div>
  );
};

/**
 * Renders a full column for a rank (user + podium)
 */
const RankColumn = ({ rankData }) => {
  const { rank, user, podium, level } = rankData;
  return (
    <div className="flex flex-col items-center gap-3 w-1/3 max-w-xs">
      <UserInfo user={user} />
      <PodiumBox rank={rank} podium={podium} level={level} />
    </div>
  );
};

/**
 * The main Leaderboard card component
 */
const Leaderboard = () => {
  return (
    <div className="relative bg-gray-200 rounded-3xl shadow-xl p-8 pt-9 w-full max-w-4xl mx-auto">
      {/* Podium Area */}
      <div className="flex items-end justify-center gap-4">
        {ranksData.map((rankData) => (
          <RankColumn key={rankData.rank} rankData={rankData} />
        ))}
      </div>
    </div>
  );
};

/**
 * The "Total stars rank" chip above the main card
 */
const HeaderChip = () => {
  return (
    <div className="mb-4 text-indigo-700 bg-white shadow-md font-semibold px-6 py-2.5 rounded-full z-10 relative">
      Leaderboard Peminjaman Motor
    </div>
  );
};

/**
 * Main App component
 */
export default function App() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased pt-18">
      <HeaderChip />
      <Leaderboard />
    </div>
  );
}