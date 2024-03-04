import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { Datum } from "@/types/beatleaderreq";
import { ScoreSaberItem } from "@/types/scoresaber";
import {BarChart, Key, Pin, Sparkles, Star} from "lucide-react";

const diffConv = (diff:string) => {
  if(diff.includes('ExpertPlus')){
    return "E+"
  }else if(diff.includes('Expert')) {
    return "EX"
  }else if(diff.includes("Hard")){
    return "H"
  }else if(diff.includes("Normal")){
    return "N"
  }
  return "E"
}

export default function BeatLeaderItem(
{
  item
}:{
    item: Datum & {
        pinned?: boolean
    }
}
) {
  return (
    <div className="relative">
        <div className={"rounded-lg flex bg-black/[.4] space-x-2 backdrop-blur-md"}>
            <Avatar className={"rounded-md h-14 w-14"}>
            <AvatarImage src={item.leaderboard.song.coverImage}></AvatarImage>
            </Avatar>
            <div className={"flex flex-col justify-between py-0.5"}>
            <div className={"font-semibold text-xs text-ellipsis overflow-hidden line-clamp-1"}>
                {item.leaderboard.song.name}
            </div>
            <div className={"text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1 "}>
                <div>
                <span><BarChart className={"w-3 h-3"}/></span>
                <span>{diffConv(item.leaderboard.difficulty.difficultyName)}</span>
                </div>
                <div>
                <span><Star className={"w-3 h-3"}/></span>
                <span>{item.leaderboard.difficulty.stars?.toFixed(2)??"none"} </span>
                </div>
                <div>
                <span><Key className={"w-3 h-3"}/></span>
                <span>{item.leaderboard.song.hash.slice(0, 5).toLowerCase()}</span>
                </div>
            </div>
            <div className={"flex space-x-2 text-xs"}>
                <span>{(item.baseScore/item.leaderboard.difficulty.maxScore * 100).toFixed(2)}%</span>
                <span className={"text-orange-200"}>{item.pp.toFixed(1)}PP</span>
            </div>
            </div>
        </div>
        {
           item.pinned && <div className="absolute right-1 bottom-1 text-white">
           <Pin className="rotate-45 h-4 w-4"/>
       </div>
        }
        
    </div>

  )
}