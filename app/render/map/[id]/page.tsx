// 'use client'
import React from "react";
import { BSMap} from "@/types/beatsaver";
import config from "@/lib/config";
import { Calendar, Clock, HeartPulse, Key, ThumbsDown, ThumbsUp } from "lucide-react";
import Progress from "@/components/progress";
import { getTag } from "@/lib/tag-format";
import { CharacteristicIcon } from "@/components/characteristic";
import dayjs from 'dayjs'
import duration from "dayjs/plugin/duration";
import { formatNumber, formatTime } from "@/lib/format";
import ReplayQRCode from "@/components/qrcode";
dayjs.extend(duration)
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
  const bg = "https://www.loliapi.com/acg/pe/"
  return(
  <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
      <div
         className={"h-auto w-[300px] rounded-none"}
         id="render-result"
      style={{
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'cover',
      }}
      >
        <div className={"bg-blend-darken bg-black/[.8]  text-white h-full  rounded-none"}>
          <img src={bsMap.versions[0].coverURL} className="rounded-lg  w-[300px]"/>
          <div className="flex items-center justify-center w-full h-full flex-col">

          {/* <div id={bsMap.id} className="border rounded-md  w-[300px] shadow-md bg-black/[.6] "> */}
            <div className="p-4">
              <div className="text-ellipsis  line-clamp-2">
                <span
                  className="text-ellipsis  line-clamp-2 text-xl font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                {bsMap.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-ellipsis line-clamp-1  break-all flex space-x-4 items-center ">
                  <img src={bsMap.uploader.avatar} className="rounded-full w-8 h-8"/>
                  <span className="text-xl text-ellipsis break-all line-clamp-1">{bsMap.uploader.name}</span>
                </div>
              </div>

              <div className="meta  flex space-x-4 text-xs py-2 items-center">
                <div className="flex space-x-1 items-center justify-between">
                  <HeartPulse className="w-3 h-3"/>
                  <span>{bsMap.metadata.bpm}</span>
                </div>
                <div className="flex space-x-1 items-center justify-between">
                  <Clock className="w-3 h-3"/>
                  <span>{dayjs.duration(bsMap.metadata.duration, 'seconds').format('mm:ss')}</span>
                </div>

                <div className="flex space-x-1 items-center justify-between">
                  <Key className="w-3 h-3"/>
                  <span className="font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                    {bsMap.id}
                  </span>
                </div>
                <div className="flex space-x-2 text-xs">
                  <span><Calendar className="h-3 w-3"/></span>
                  <span>{formatTime(bsMap.lastPublishedAt)}</span>
                </div>
              </div>

              <div className="tags flex flex-wrap justify-start">
                {
                  bsMap.tags?.sort(((a, b) => b.length - a.length))
                    ?.map(item => (
                      <span className="text-xs mx-1 text-white bg-red-500 rounded px-1" key={item}>{getTag(item)}</span>
                    ))
                }
              </div>
              <div className="flex space-x-2">
                <div className="percentage w-42 py-2 flex text-xs items-center space-x-4">
                  <Progress value={bsMap.stats.score * 100}/>
                  <span>{(bsMap.stats.score * 100).toFixed(1)}%</span>
                </div>
                <div className="flex space-x-1 items-center text-xs">
                  <span><ThumbsUp className="h-3 w-3"/></span>
                  <span>{formatNumber(bsMap.stats.upvotes)}</span>
                </div>
                <div className="flex space-x-1 items-center text-xs">
                  <span><ThumbsDown className="h-3 w-3"/></span>
                  <span>{formatNumber(bsMap.stats.downvotes)}</span>
                </div>
              </div>

              <span className="font-bold">难度</span>
              <div className="grid grid-cols-2">
                {
                  bsMap.versions[0].diffs.map(diff => (
                    <div key={diff.difficulty + diff.characteristic} className="text-xs space-x-1 flex">
                      <span className="h-3 w-3 shrink-0"><CharacteristicIcon
                        characteristic={diff.characteristic}/></span>
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

              <div className={'flex items-center justify-between pt-2'}>
                <div className={'text-[10px] text-opacity-70 text-slate-100 align-bottom mt-auto mb-0'}>
                  Powered by BSBot
                </div>
                <div className="flex items-center space-x-2">
                  <div className={'flex flex-col items-center'}>
                    <ReplayQRCode url={`https://beatsaver.com/maps/${bsMap.id}`} className={'w-10'}/>
                    <div className={"text-[8px] font-light"}>beatsaver</div>
                  </div>
                  <div className={'flex flex-col items-center'}>
                    <ReplayQRCode url={`https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`} className={'w-10'}/>
                    <div className={"text-[8px] font-light"}>preview</div>
                  </div>
                </div>
              </div>

            </div>
            {/* </div> */}

          </div>
        </div>
      </div>
    </div>
  </>
  )
}