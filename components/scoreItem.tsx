import {BeatLeaderItem} from "@/types/beatleader";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {BarChart, Key, Sparkles, Star} from "lucide-react";

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

export default function ScoreItem(
{
  scoreItem
}:{
  scoreItem: BeatLeaderItem
}
) {
  return (
    <div className={"rounded-lg flex bg-black/[.4] space-x-2"}>
        <Avatar className={"rounded-md h-14 w-14"}>
          <AvatarImage src={scoreItem.leaderboard.coverImage}></AvatarImage>
        </Avatar>
        <div className={"flex flex-col justify-between py-0.5"}>
          <div className={"font-semibold text-xs text-ellipsis overflow-hidden line-clamp-1"}>
            {scoreItem.leaderboard.songName}
          </div>
          <div className={"text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1 "}>
            <div>
              <span><BarChart className={"w-3 h-3"}/></span>
              <span>{diffConv(scoreItem.leaderboard.difficulty.difficultyRaw)}</span>
            </div>
            <div>
              <span><Star className={"w-3 h-3"}/></span>
              <span>{scoreItem.leaderboard.stars} </span>
            </div>
            <div>
              <span><Key className={"w-3 h-3"}/></span>
              <span>{scoreItem.leaderboard.songHash.slice(0, 5).toLowerCase()}</span>
            </div>
          </div>
          <div className={"flex space-x-2 text-xs"}>
            <span>{(scoreItem.score.baseScore/scoreItem.leaderboard.maxScore * 100).toFixed(2)}%</span>
            <span className={"text-orange-200"}>{scoreItem.score.pp.toFixed(1)}PP</span>
          </div>
        </div>
    </div>
  )
}