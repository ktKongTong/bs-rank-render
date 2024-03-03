// 'use client'
import {useBLPlayer, useBLPlayerInfo} from "@/hooks/usePlayer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {twJoin} from "tailwind-merge";
import ScoreItem from "@/components/scoreItem";
import {ScoreSaberUser} from "@/types/scoresaber";
import {BeatLeaderItem} from "@/types/beatleader";
import {countryEmoji} from "@/lib/utils";


const BASE_URL = process.env.BASE_URL
async function getScoreItem(uid:string) {
  const url = `${BASE_URL}/api/player/${uid}`
  const res = await fetch(url).then(res=> res.json())
  return res as BeatLeaderItem[][]
}

async function getUserInfo(uid:string) {
  const url = `${BASE_URL}/api/player/${uid}/full`
  const res =  await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch userInfo:'+uid)
  }
  return (await res.json()) as ScoreSaberUser
}


export default async function BSPlayerRankPage({params}: { params: { uid: string } }) {
  console.log(params.uid)
  // const {scoreUser,isLoading:isUserLoading,error:userError} = useBLPlayerInfo(params.uid)
  // const {leaderItems,isLoading,error} = useBLPlayer(params.uid)
  const [leaderItem, scoreUser] = await Promise.all([ getScoreItem(params.uid), getUserInfo(params.uid)])
  const leaderItems = leaderItem.flatMap(item=>item)
  const bg = scoreUser.profilePicture
  return(
  <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
      <div
         className={"h-[680px] w-[960px] rounded-md"}
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
      }}
      >
        <div className={"bg-blend-darken bg-black/[.6] p-4 text-white h-full rounded-lg"}>
          <div className={"flex space-x-4 pb-2"}>
            <Avatar className={"h-32 w-32 rounded-md"}>
              <AvatarImage src={scoreUser.profilePicture}/>
              <AvatarFallback>{scoreUser.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className={"flex flex-col justify-between"}>
              <span className={"text-3xl font-bold"}>{scoreUser.name}</span>
              <div className={"flex space-x-2 text-md font-bold items-center"}>
                <span >🌎 # {scoreUser.rank}</span>
                <span >{countryEmoji(scoreUser.country)} # {scoreUser.countryRank}</span>
              </div>
              <div
                // className={"text-3xl font-bold}
                className={twJoin(
                  "text-4xl font-bold ",
                  " bg-gradient-to-r bg-clip-text text-transparent from-blue-300 to-red-300",
                  "text-orange-100"
                  )}
              >
                {scoreUser.pp} PP
              </div>
            </div>
            <div className={"text-4xl pl-40 items-center flex text-gray-100 opacity-70"}>
              <span>coming soon 👷</span>
            </div>
          </div>
          <div className={"grid grid-cols-4 gap-2"}>
          {
            leaderItems.map(((item, idx) => (
              <ScoreItem scoreItem={item} key={idx}/>
            )))
          }
          </div>

        </div>
      </div>
    </div>
  </>
  )
}