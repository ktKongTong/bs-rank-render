import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import config from "@/lib/config";
import { Datum } from "@/types/beatleaderreq";
import { BarChart, Check, Key, Notebook, Star } from "lucide-react";
import ReplayQRCode from "@/components/qrcode";
import { diffConv } from "@/lib/utils";
import Flags from "@/components/flag";
import ScoreGraph from "@/components/scoregraph";

const BASE_URL = config.constants.BASE_URL

async function getScoreInfo(scoreid:string) {
    const url = `${BASE_URL}/api/beatleader/score/${scoreid}`
    const res =  await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch scoreInfo:'+ scoreid)
    }
    return (await res.json()) as Datum
  }
  

export default async function BSPlayerRankPage({params,searchParams}: { params: { scoreid: string },searchParams: { [key: string]: string | string[] | undefined };}) {

    const [score] = await Promise.all([
        getScoreInfo(params.scoreid),
    ])
    console.log("fetch scoreInfo", score)

    const bg = "https://www.loliapi.com/acg/pc/"

    return (
        <>
    <div className={"flex flex-col bg-slate-100 justify-center items-center min-h-screen"}>
        <div
            className={"h-[720px] w-[400px] rounded-md bg-gradient-to-br from-red-300 to-blue-300"}
            id="render-result"
            // style={{
            //     backgroundImage: `url('${bg}')`,
            //     backgroundSize: 'cover',
            // }}
        >
            <div className={"bg-blend-darken bg-black/[.6] p-4 text-white h-full rounded-lg flex flex-col"}>
                <div className="flex space-x-4 items-center justify-between text-xl font-bold">
                    <div className="flex space-x-4 items-center justify-between text-xl font-bold">
                        <Avatar className={"h-12 w-12 rounded-full"}>
                            <AvatarImage src={score.player.avatar}/>
                            <AvatarFallback>{score.player.name.slice(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            {score.player.name}
                        </div>
                    </div>
                    <div>
                        <ReplayQRCode url={`https://replay.beatleader.xyz/?scoreId=${score.id}`}/>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <Avatar className={"h-36 w-36 rounded-md"}>
                        <AvatarImage src={score.song.cover}/>
                        <AvatarFallback>{score.song.name.slice(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs font-bold">
                        <div className="text-xl">{score.song.name}</div>
                        <div className="grid grid-cols-2">
                            <div className="flex items-center">
                                <Notebook className="h-4 w-4"/>
                                <div>{score.difficulty.notes}</div>
                            </div>
                        </div>
                        <div className="text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1">
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
                        </div>
                    </div>
                </div>
                <div className="text-2xl font-bold px-2">
                    <div className="flex justify-between">
                        <span> # {score.rank}</span>
                        <span>{score.pp.toFixed(2)}PP</span>
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