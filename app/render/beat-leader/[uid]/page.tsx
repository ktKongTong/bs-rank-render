// 'use client'
import {useBLPlayer, useBLPlayerInfo} from "@/hooks/usePlayer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {twJoin} from "tailwind-merge";
import ScoreItem from "@/components/scoreItem";
import {ScoreSaberItem, ScoreSaberUser} from "@/types/scoresaber";
import {countryEmoji} from "@/lib/utils";
import config from "@/lib/config";
import SkillGraph from "@/components/skill-graph";
import { BeatLeaderUser } from "@/types/beatleader";
import getPart from "@/lib/blpart";
import { BeadLeaderScoresResponse, Datum } from "@/types/beatleaderreq";
import BeatLeaderItem from "@/components/beatleaderItem";

const BASE_URL = config.constants.BASE_URL

async function getBeatLeaderItem(uid:string) {
  const url = `${BASE_URL}/api/bealeader/${uid}/scores`
  console.log(url)
  const res = await fetch(url).then(res=> res.json())
  return (res as BeadLeaderScoresResponse).data.map(item=>({...item,pinned:false}))
}
async function getPinnedBeatLeaderItem(uid:string) {
  const url = `${BASE_URL}/api/bealeader/${uid}/pinnedScores`
  console.log(url)
  const res = await fetch(url).then(res=> res.json())
  return (res as Datum[]).map(item=>({...item,pinned:true}))
}
async function getUserInfo(uid:string) {
  const url = `${BASE_URL}/api/bealeader/${uid}`
  console.log(url)
  const res =  await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch userInfo:'+uid)
  }
  return (await res.json()) as BeatLeaderUser
}


export default async function BSPlayerRankPage({params}: { params: { uid: string } }) {
  console.log(params.uid)
  // const {scoreUser,isLoading:isUserLoading,error:userError} = useBLPlayerInfo(params.uid)
  // const {leaderItems,isLoading,error} = useBLPlayer(params.uid)
  
  const [pinnedItems,topLeaderItems, user] = await Promise.all([
     getPinnedBeatLeaderItem(params.uid),
     getBeatLeaderItem(params.uid),
      getUserInfo(params.uid)
    ])
  
  topLeaderItems.filter(item=> pinnedItems.some(pinned=>pinned.id === item.id))
  const leaderItems = pinnedItems.concat(topLeaderItems).slice(0,32)
  const part = getPart(user)
  // const bg = user.profileSettings.profileCover ?? user.avatar
  const bg = "https://www.loliapi.com/acg/pc/"
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
          <div className={"flex justify-between"}>
            <div className="flex space-x-4 pb-2">
            <Avatar className={"h-32 w-32 rounded-md"}>
              <AvatarImage src={user.avatar}/>
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className={"flex flex-col justify-between"}>
              <span className={"text-3xl font-bold"}>{user.name}</span>
              <div className={"flex space-x-2 text-md font-bold items-center"}>
                <span >🌎 # {user.rank}</span>
                <span >{countryEmoji(user.country)} # {user.countryRank}</span>
              </div>
              <div
                // className={"text-3xl font-bold}
                className={twJoin(
                  "text-4xl font-bold ",
                  " bg-gradient-to-r bg-clip-text text-transparent from-blue-300 to-red-300",
                  "text-orange-100"
                  )}
              >
                {user.pp} PP
              </div>
            </div>
            </div>
            <div className="ml-auto mr-0">
            <SkillGraph factorA={part.accPpPart} factorB={part.techPpPart} factorC={part.passPpPart}/>
            </div>
          </div>
          <div className={"grid grid-cols-4 gap-2"}>
          {
            leaderItems.map(((item, idx) => (
              <BeatLeaderItem item={item} key={idx}/>
            )))
          }
          </div>

        </div>
      </div>
    </div>
  </>
  )
}