// 'use client'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {twJoin} from "tailwind-merge";
import {countryEmoji} from "@/lib/utils";
import config from "@/lib/config";
import SkillGraph from "@/components/skill-graph";
import { BeatLeaderUser } from "@/types/beatleader";
import getPart from "@/lib/blpart";
import { BeadLeaderScoresResponse, Datum } from "@/types/beatleaderreq";
import BeatLeaderItem from "@/components/beatleaderItem";
import ScoreBadge from "@/components/socre-badge";
import { getHeadsetForHMD, headset } from "@/lib/blheadset";
import Flags from "@/components/flag";

const BASE_URL = config.constants.BASE_URL

async function getBeatLeaderItem(uid:string, q:string|undefined) {
  const url = `${BASE_URL}/api/beatleader/${uid}/scores?${q}`
  console.log(url)
  const res = await fetch(url).then(res=> res.json())
  return (res as BeadLeaderScoresResponse).data.map(item=>({...item,pinned:false}))
}
async function getPinnedBeatLeaderItem(uid:string) {
  const url = `${BASE_URL}/api/beatleader/${uid}/pinnedScores`
  console.log(url)
  const res = await fetch(url).then(res=> res.json())
  return (res as Datum[]).map(item=>({...item,pinned:true}))
}
async function getUserInfo(uid:string) {
  const url = `${BASE_URL}/api/beatleader/${uid}`
  console.log(url)
  const res =  await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch userInfo:'+uid)
  }
  return (await res.json()) as BeatLeaderUser
}


export default async function BSPlayerRankPage({params,searchParams}: { params: { uid: string },searchParams: { [key: string]: string | string[] | undefined };}) {
  console.log(params.uid)
  console.log(searchParams)
  let q
  if(searchParams) {
    q = Object.keys(searchParams).map(item=> {
      let qi = searchParams[item]
      if (!qi) {
        qi = []
      }else if (typeof qi === 'string'){
        qi = [qi]
      }
      return qi.map(it=>`${item}=${it}`).join('&')
    })
    .join("&")
  }
  
  const [pinnedItems,topLeaderItems, user] = await Promise.all([
     getPinnedBeatLeaderItem(params.uid),
     getBeatLeaderItem(params.uid,q),
      getUserInfo(params.uid)
    ])
  
  topLeaderItems.filter(item=> pinnedItems.some(pinned=>pinned.id === item.id))
  const leaderItems = pinnedItems.concat(topLeaderItems).slice(0,24)
  const part = getPart(user)
  // const bg = user.profileSettings.profileCover ?? user.avatar
  const bg = "https://www.loliapi.com/acg/pc/"
    // console.log(user)
  return(
  <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
      <div
         className={"h-[720px] w-[1024px] rounded-md"}
         id="render-result"
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
      }}
      >
        <div className={"bg-blend-darken bg-black/[.6] p-4 text-white h-full rounded-lg flex flex-col justify-between"}>
          <div className={"flex justify-between"}>
            <div className="flex space-x-4 pb-2">
            <Avatar className={"h-36 w-36 rounded-md"}>
              <AvatarImage src={user.avatar}/>
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className={"flex flex-col justify-between"}>
              <span className={"text-3xl font-bold"}>{user.name}</span>
              <div className={"flex space-x-2 text-md font-bold items-center"}>
                <span >🌎 # {user.rank}</span>
                <span className="flex items-center space-x-1">
                  <Flags flagNationCode={user.country}/>
                  <span># {user.countryRank}</span>
                </span>
              </div>

              <div className="flex gap-2 align-items-center "> 
                <ScoreBadge className="w-auto text-white" name={"P"} count={user.scoreStats.topPlatform}/>
                <ScoreBadge className="w-auto text-white" name={"H"} count={getHeadsetForHMD(user.scoreStats.topHMD)}/>
                <ScoreBadge className="w-auto text-white" name={"R"} count={user.scoreStats.rankedPlayCount}/>
              </div>
              <div
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
            <div className="px-3 flex flex-col justify-end items-center grow">
              {
                user.badges.length > 0 && 
                <div className="grid grid-cols-3 gap-2 justify-self-center align-items-cener justify-items-center mb-auto mt-2">
                  {
                    user.badges.map(badge=>(<>
                      <img alt={badge.description} key={badge.id} src={badge.image} width={"70px"} height={"20px"} className="self-center w-[70px] h-5"></img>
                    </>))
                  }
                </div>
              }

              <div className="grid grid-cols-3 gap-2 align-items-center py-2">
                <ScoreBadge name={"SS+"} count={user.scoreStats.sspPlays}/>
                <ScoreBadge name={"SS"} count={user.scoreStats.ssPlays}/>
                <ScoreBadge name={"S+"} count={user.scoreStats.spPlays}/>
                <ScoreBadge name={"S"} count={user.scoreStats.sPlays}/>
                <ScoreBadge name={"A"} count={user.scoreStats.aPlays}/>
              </div>
            {/* more badages */}
            </div>

            <div className="ml-auto mr-4  flex justify-center items-center">
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