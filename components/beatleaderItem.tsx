import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { diffConv } from "@/lib/utils";
import { Datum } from "@/types/beatleaderreq";
import { ScoreSaberItem } from "@/types/scoresaber";
import {BarChart, Key, Pin, Sparkles, Star, Wrench} from "lucide-react";



const getModifiers = (modifiers:string)=> {
  return modifiers?modifiers.split(','):['None']
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
            <Avatar className={"rounded-md h-20 w-20"}>
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
                  <span>{item.leaderboard.song.id.toLowerCase().replaceAll('x','')}</span>
                  </div>
              </div>
              <div className={"flex space-x-2 text-xs"}>
                  <span>{(item.baseScore/item.leaderboard.difficulty.maxScore * 100).toFixed(2)}%</span>
                  <span className={"text-orange-200"}>{item.pp.toFixed(1)}PP</span>
              </div>
              <div className="text-xs flex flex-wrap space-x-2 items-center">
              <Wrench className="h-3 w-3"/>
                {
                  getModifiers(item.modifiers).map(modifier=>(
                    <span key={modifier}>{modifier}</span>
                  ))
                }
              </div>
            </div>
        </div>
        
          <div className="absolute right-1 bottom-1 text-white flex text-xs space-x-2">
            {
              item.fullCombo && <span className="from-red-300 to-red-300 bg-gradient-to-r bg-clip-text text-transparent">FC</span>
            }
          {
           item.pinned && <Pin className="rotate-45 h-3 w-3"/>
          }
          </div>
        
        
    </div>

  )
}