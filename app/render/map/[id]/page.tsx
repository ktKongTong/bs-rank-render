// 'use client'
import {useBLPlayer, useBLPlayerInfo} from "@/hooks/usePlayer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {twJoin} from "tailwind-merge";
import ScoreItem from "@/components/scoreItem";
import {ScoreSaberItem, ScoreSaberUser} from "@/types/scoresaber";
import { BSMap} from "@/types/beatsaver";
import {countryEmoji} from "@/lib/utils";
import config from "@/lib/config";
import { Clock, HeartPulse, Key } from "lucide-react";
import * as ProgressPrimitive from "@radix-ui/react-progress"
import Progress from "@/components/progress";

const BASE_URL = config.constants.BASE_URL

async function getMapDetail(id:string) {
  const url = `${BASE_URL}/api/beatsaver/${id}`
  const res = await fetch(url).then(res=> res.json())

  return res as BSMap
}



export default async function BSPlayerRankPage({params}: { params: { id: string } }) {
  console.log(params.id)
  // const {scoreUser,isLoading:isUserLoading,error:userError} = useBLPlayerInfo(params.uid)
  // const {leaderItems,isLoading,error} = useBLPlayer(params.uid)
  const bsMap = await getMapDetail(params.id)
  const bg = bsMap.versions[0].coverURL
  return(
  <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
      <div
         className={"h-auto w-[300px] rounded-lg"}
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
      }}
      >
        <div className={"bg-blend-darken bg-black/[.8]  text-white h-full rounded-lg"}>
        <img src={bsMap.versions[0].coverURL} className="rounded-lg  w-[300px]"/>
        <div className="flex items-center justify-center w-full h-full flex-col">

        {/* <div id={bsMap.id} className="border rounded-md  w-[300px] shadow-md bg-black/[.6] "> */}
          <div className="p-4">
            <div className="text-ellipsis  line-clamp-2">
        <span className="text-ellipsis  line-clamp-2 text-xl font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
        {bsMap.name}
        </span>
            </div>

            <div className="author flex space-x-4 items-center ">
              <img src={bsMap.uploader.avatar} className="rounded-full w-8 h-8"/>
              <span className="text-xl">{bsMap.uploader.name}</span>
            </div>
            <div className="meta  flex space-x-4 text-xs py-2 items-center">
              <div className="flex space-x-1 items-center justify-between">
              <HeartPulse  className="w-3 h-3"/>
                <span>{bsMap.metadata.bpm}</span>
              </div>
              <div className="flex space-x-1 items-center justify-between">
                <Clock className="w-3 h-3"/>
                <span>{bsMap.metadata.duration}s</span>
              </div>

              <div className="flex space-x-1 items-center justify-between">
                <Key className="w-3 h-3"/>
                <span className="font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                  {bsMap.id}
                </span>
              </div>
            </div>

            <div className="tags flex flex-wrap justify-start">
              {
                bsMap.tags
                .sort(((a,b)=>b.length - a.length))
                .map(item=> (
                  <span className="text-xs mx-1 text-white bg-red-500 rounded px-1" key={item}>{item}</span>
                ))
              }
            </div>
            <div className="percentage w-42 py-2 flex text-xs items-center space-x-4">
              <Progress value={bsMap.stats.score * 100}/>
              <span>{(bsMap.stats.score * 100).toFixed(1)}%</span>
            
            </div>
            <span className="font-bold">难度</span>
            <div className="grid grid-cols-2">
              {
                bsMap.versions[0].diffs.map(diff=> (
                  <div key={diff.difficulty+diff.characteristic} className="text-xs flex space-x-2">
                    <span>{diff.difficulty}</span>
                    <span>{(diff.nps).toFixed(2)}</span>
                  </div>
                ))
              }
            </div>

            <span className="font-bold">描述</span>
            <p className="text-xs">
              {bsMap.description}
            </p>
          </div>
        {/* </div> */}

        </div>

        </div>
      </div>
    </div>
  </>
  )
}