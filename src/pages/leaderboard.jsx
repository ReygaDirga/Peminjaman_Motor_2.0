import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const RankBadge = ({ rank, avatar }) => (
  <div className="flex items-center gap-3">
    <span className="text-white font-bold">#{rank}</span>
    <img
      src={avatar}
      alt="avatar"
      className="w-10 h-10 rounded-full object-cover border-2 border-[#70F2FF]"
    />
  </div>
);

const LeaderboardRow = ({ player }) => {
  return (
    <div className="border-t border-[#70F2FF] text-white p-4">

      {/* MOBILE */}
      <div className="flex gap-4 sm:hidden">
        <RankBadge rank={player.rank} avatar={player.avatar} />

        <div className="flex-1">
          <div className="font-semibold text-sm">
            {player.name}
          </div>

          <div className="grid grid-cols-2 text-xs text-gray-300 mt-1">
            <span>Total Peminjaman: {player.id}</span>
            <span className="text-right font-semibold">
              Total Jam: {player.score}
            </span>
          </div>
        </div>
      </div>
      <div className="hidden sm:grid sm:grid-cols-4 items-center text-gray-300 text-sm md:text-base">
        <RankBadge rank={player.rank} avatar={player.avatar} />
        <span>{player.name}</span>
        <span>{player.id}</span>
        <span>{player.score}</span>
      </div>

    </div>
  );
};

export default function Leaderboard() {

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    const { data: leaderboard, error: lbError } = await supabase
      .from("borrow_leaderboard")
      .select("*")
      .order("rank", { ascending: true });

    if (lbError) {
      console.error(lbError);
      return;
    }
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("name, photo_url");

    if (userError) {
      console.error(userError);
      return;
    }

    const formatted = leaderboard.map((item) => {
      const user = users.find(u => u.name === item.name);
      let avatar = "";
      if (user?.photo_url) {
        const { data } = supabase
          .storage
          .from("avatars")
          .getPublicUrl(user.photo_url);

        avatar = data.publicUrl;
      }

      return {
        rank: item.rank,
        name: item.name,
        id: item.total_peminjaman,
        score: item.total_jam,
        avatar: avatar
      };
    });

    setLeaderboardData(formatted);
  }

  return (
    <div className="min-h-screen w-full flex items-center bg-[#1f2229] justify-center p-4 md:p-10">
      <div className="w-full max-w-4xl backdrop-blur-md rounded-xl border border-[#70F2FF] shadow-2xl overflow-hidden">

        <div className="flex justify-center items-center gap-4 py-6 border-b border-[#70F2FF]">
          <span className="text-yellow-400">🏆</span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-300 tracking-widest">
            LEADERBOARD
          </h1>
          <span className="text-yellow-400">🏆</span>
        </div>

        <div className="hidden sm:grid sm:grid-cols-4 px-6 py-3 text-gray-300 text-xs uppercase tracking-wider">
          <span>Rank</span>
          <span>Name</span>
          <span>Total Peminjaman</span>
          <span>Total Jam Pemakaian</span>
        </div>

        {leaderboardData.map((player) => (
          <LeaderboardRow key={player.rank} player={player} />
        ))}

      </div>
    </div>
  );
}