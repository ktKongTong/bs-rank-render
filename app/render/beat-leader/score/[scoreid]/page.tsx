import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import config from "@/lib/config";
import { Datum } from "@/types/beatleaderreq";
import { BarChart, Check, Key, Notebook, Star,Map, Clock, HeartPulse, ThumbsUp, ThumbsDown, Calendar } from "lucide-react";
import ReplayQRCode from "@/components/qrcode";
import { diffConv } from "@/lib/utils";
import ScoreGraph from "@/components/scoregraph";
import { BSMap } from "@/types/beatsaver";
import { formatDuration, formatTime } from "@/lib/format";
import Progress from "@/components/progress";

const BASE_URL = config.constants.BASE_URL

async function getScoreInfo(scoreid:string) {
    const url = `${BASE_URL}/api/beatleader/score/${scoreid}`
    const res =  await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch scoreInfo:'+ scoreid)
    }
    return (await res.json()) as Datum
}
async function getBeatMapInfo(hashId:string) {
    const url = `${BASE_URL}/api/beatsaver/hash/${hashId}`
    const res =  await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch mapInfo:'+ hashId)
    }
    return (await res.json()) as BSMap
}

export default async function BSPlayerRankPage({params,searchParams}: { params: { scoreid: string },searchParams: { [key: string]: string | string[] | undefined };}) {

    const [score] = await Promise.all([
        getScoreInfo(params.scoreid),
    ])

    const beatmap = await getBeatMapInfo(score.song.hash)

    console.log("fetch scoreInfo", score)

    const bg = "https://www.loliapi.com/acg/pc/"

    return (
        <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
        <div
            className={"h-[720px] w-[400px] rounded-none bg-gradient-to-br from-red-300 to-blue-300"}
            id="render-result"
            style={{
                backgroundImage: `url('${bg}')`,
                backgroundSize: 'cover',
            }}
        >
            <div className={"bg-blend-darken bg-black/[.6] p-4 text-white h-full rounded-none flex flex-col"}>
                <div className="flex space-x-4 items-center justify-between text-xl font-bold">
                    <div className="flex space-x-4 items-center justify-between text-2xl font-bold">
                        <Avatar className={"h-16 w-16 rounded-full"}>
                            <AvatarImage src={score.player.avatar}/>
                            <AvatarFallback>{score.player.name.slice(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            {score.player.name}
                        </div>
                    </div>
                    <div>
                        <ReplayQRCode url={`https://replay.beatleader.xyz/?scoreId=${score.id}`} withImg/>
                    </div>
                </div>
                <div className="flex space-x-4 h-40">
                    <Avatar className={"h-40 w-40 rounded-md"}>
                        <AvatarImage src={score.song.cover}/>
                        <AvatarFallback>{score.song.name.slice(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs font-bold flex flex-col justify-between">
                        <div className="text-xl text-ellipsis line-clamp-2">{score.song.name}</div>
                        <div className="flex space-x-2 items-center text-sm">
                            <Avatar className={"h-4 w-4 rounded-full"}>
                                <AvatarImage src={beatmap.uploader.avatar}/>
                                <AvatarFallback>{score.song.mapper.slice(0,1)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center justify-between">
                                <div className="text-ellipsis line-clamp-1">
                                    {score.song.mapper}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs grid grid-cols-3 gap-1 *:space-x-1 *:flex *:items-center font-normal">
                            <div className="flex items-center text-ellipsis col-span-3 line-clamp-1">
                                    <Calendar className="h-3 w-3"/>
                                    <span>{formatTime(beatmap.lastPublishedAt)}</span>
                            </div>
                            <div>
                                <span><BarChart className={"w-3 h-3"}/></span>
                                <span>{diffConv(score.difficulty.difficultyName)}</span>
                            </div>
                            <div>
                                <span><Star className={"w-3 h-3"}/></span>
                                <span>{score.difficulty.stars?.toFixed(2)??"none"} </span>
                            </div>
                            <div>
                                <span><Key className={"w-3 h-3"}/></span>
                                <span>{score.song.id.toLowerCase().replaceAll('x','')}</span>
                            </div>
                            
                            <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3"/>
                                <span>{beatmap.stats.upvotes}</span>
                            </div>
                            <div className="flex items-center">
                                <ThumbsDown className="h-3 w-3"/>
                                <span>{beatmap.stats.downvotes}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-3 w-3"/>
                                <span>{formatDuration(beatmap.metadata.duration)}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs font-normal">
                            <Progress value={beatmap.stats.score * 100} className="h-1.5"  containerClassName="h-1.5"/>
                            <span>{(beatmap.stats.score * 100).toFixed(2)} %</span>
                        </div>
                    </div>
                </div>
                <div className="text-xl font-bold pt-2">
                    <div className="flex justify-between">
                        <span> # {score.rank}</span>
                        <span>{score.pp.toFixed(2)} PP</span>
                    </div>

                    {
                        <div className="flex items-center justify-between">
                            <span>Accuracy</span>
                            <span>{(score.accuracy * 100).toFixed(2)} %</span>
                        </div>
                    }
                    {
                        score.fullCombo &&
                         <div className="flex items-center justify-between">
                            <span>Full Combo</span>
                            <Check/>
                         </div>
                    }
                    {
                        score.maxCombo &&
                         <div className="flex items-center justify-between">
                            <span>Max Combo</span>
                            <span>{score.maxCombo}</span>
                         </div>
                    }
                    {
                         <div className="flex items-center justify-between">
                            <span>Missed Notes</span>
                            <span>{score.missedNotes}</span>
                         </div>
                    }
                    {
                         <div className="flex items-center justify-between">
                            <span>Total Mistakes</span>
                            <span>{score.missedNotes}</span>
                         </div>
                    }
                    {
                         score.modifiers && <div className="flex items-center justify-between">
                            <span>Modifiers</span>
                            <span>{score.modifiers}</span>
                         </div>
                    }
                </div>
                <div className="align-end mt-auto mb-2">
                    <span className="text-xl font-bold">
                        AccGraph
                    </span>
                    <ScoreGraph scoreId={score.id} scoreInfo={score}/>
                </div>

            </div>
        </div>
    </div>
    </>
    )


}