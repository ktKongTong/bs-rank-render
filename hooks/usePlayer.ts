import useSWR from "swr";
import {useQuery} from "@tanstack/react-query";
import {ScoreSaberUser} from "@/types/scoresaber";

export async function jsonFetcher(
  input: RequestInfo,
  init?: RequestInit
): Promise<any> {
  const res = await fetch(input, init);
  return res.json();
}

// todo change to ssr
// export const useBLPlayer = (uid: string) => {
//   const { isPending,isLoading, error, data } = useQuery({
//     queryKey: ['repoData'],
//     queryFn: () =>
//       fetch(`/api/player/${uid}`).then((res) =>
//         res.json(),
//       ),
//   })
//   const leaderItems:BeatLeaderItem[] = data ? [].concat(...data) : [];
//   return {
//     leaderItems,
//     isLoading,
//     error,
//   }
// }

export const useBLPlayerInfo = (uid: string) => {
  const { isPending,isLoading, error, data } = useQuery({
    queryKey: ['udata'],
    queryFn: () =>
      fetch(`/api/player/${uid}/full`).then((res) =>
        res.json(),
      ),
  })
  let res :ScoreSaberUser = data
  if (data) {
    res = data as ScoreSaberUser
  }
  return {
    "scoreUser":res,
    isLoading,
    error,
  }
}
